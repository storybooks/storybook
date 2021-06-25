import React from 'react';
import ReactDOM from 'react-dom';
import global from 'global';
import AnsiToHtml from 'ansi-to-html';
import dedent from 'ts-dedent';

import { StoryId, StoryKind, StoryFn, ViewMode, Channel } from '@storybook/addons';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import { StoryStore } from '@storybook/client-api';

import { NoDocs } from './NoDocs';
import { RenderStoryFunction, RenderContextWithoutStoryContext } from './types';
import { isCsf3Enabled } from './csf3';

const { document } = global;

// We have "changed" story if this changes
interface RenderMetadata {
  id: StoryId;
  kind: StoryKind;
  viewMode: ViewMode;
  getDecorated: () => StoryFn<any>;
}

const layoutClassMap = {
  centered: 'sb-main-centered',
  fullscreen: 'sb-main-fullscreen',
  padded: 'sb-main-padded',
} as const;
type Layout = keyof typeof layoutClassMap | 'none';

const classes = {
  MAIN: 'sb-show-main',
  NOPREVIEW: 'sb-show-nopreview',
  ERROR: 'sb-show-errordisplay',
};

const ansiConverter = new AnsiToHtml({
  escapeXML: true,
});

/**
 * StoryRenderer is responsible for rendering the correct story to the screen
 *
 * It is very much concerned with drawing to the screen and will do things like change classes
 * on the body etc.
 */

const cache: Record<string, boolean> = {};
export class StoryRenderer {
  render: RenderStoryFunction;

  channel?: Channel;

  storyStore: StoryStore;

  previousMetadata?: RenderMetadata;

  previousLayoutClass?: typeof layoutClassMap[keyof typeof layoutClassMap] | null;

  constructor({
    render,
    channel,
    storyStore,
  }: {
    render: RenderStoryFunction;
    channel?: Channel;
    storyStore: StoryStore;
  }) {
    this.render = render;
    this.channel = channel;
    this.storyStore = storyStore;

    this.setupListeners();
  }

  setupListeners() {
    // Channel can be null in StoryShots
    if (this.channel) {
      this.channel.on(Events.CURRENT_STORY_WAS_SET, () => this.renderCurrentStory(false));
      this.channel.on(Events.STORY_ARGS_UPDATED, () => this.forceReRender());
      this.channel.on(Events.GLOBALS_UPDATED, () => this.forceReRender());
      this.channel.on(Events.FORCE_RE_RENDER, () => this.forceReRender());
      this.channel.on(Events.DOCS_TARGETTED_RENDER, (data) => {
        setTimeout(() => {
          this.renderDocsStoryOutOfContext(data);
        }, 1);
      });
    }
  }

  forceReRender() {
    this.renderCurrentStory(true);
  }

  async renderDocsStoryOutOfContext({ id, identifier, name }: Record<string, string>) {
    // TODO, the channel seems to invoke this twice
    if (cache[id]) {
      return;
    }
    cache[id] = true;

    const targetDOMNode = document.getElementById(identifier);

    if (!targetDOMNode) {
      cache[id] = false;
      return;
    }

    const {
      metadata,
      context,
    }: {
      metadata: RenderMetadata;
      context: RenderContextWithoutStoryContext;
    } = this.getStoryMetadataAndContext(this.storyStore, id, 'docs', false);

    const { getDecorated } = metadata;

    if (getDecorated) {
      try {
        const { applyLoaders, unboundStoryFn } = context;
        console.time(`applyLoaders_${id}`);
        const storyContext = await applyLoaders();
        console.timeEnd(`applyLoaders_${id}`);
        const storyFn = () => unboundStoryFn(storyContext);

        if (targetDOMNode.querySelector('[data-is-loadering-indicator="true"')) {
          targetDOMNode.querySelector('[data-is-loadering-indicator="true"').remove();
        }

        console.time(`render_${id}`);
        await this.render({
          ...context,
          storyContext,
          storyFn,
          forceRender: true,
          targetDOMNode,
        });
        console.timeEnd(`render_${id}`);

        this.channel.emit(Events.STORY_RENDERED, id);
      } catch (err) {
        this.renderException(err);
      }
    } else {
      console.error('could not find story to render', { id, name });
    }
    cache[id] = false;
  }

  async renderCurrentStory(forceRender: boolean) {
    const { storyStore } = this;

    const loadError = storyStore.getError();
    if (loadError) {
      this.showErrorDisplay(loadError);
      return;
    }

    const { storyId, viewMode: urlViewMode } = storyStore.getSelection() || {};

    const {
      metadata,
      context,
    }: {
      metadata: RenderMetadata;
      context: RenderContextWithoutStoryContext;
    } = this.getStoryMetadataAndContext(storyStore, storyId, urlViewMode, forceRender);

    await this.renderStoryIfChanged({ metadata, context });
  }

  private getStoryMetadataAndContext(
    storyStore: StoryStore,
    storyId: string,
    urlViewMode: string,
    forceRender: boolean
  ) {
    const data = storyStore.fromId(storyId);
    const { kind, id, parameters = {}, getDecorated } = data || {};
    const { docsOnly, layout } = parameters;

    const metadata: RenderMetadata = {
      id,
      kind,
      viewMode: (docsOnly ? 'docs' : urlViewMode) as RenderMetadata['viewMode'],
      getDecorated,
    };

    this.applyLayout(metadata.viewMode === 'docs' ? 'fullscreen' : layout);

    const context: RenderContextWithoutStoryContext = {
      id: storyId,
      ...data,
      forceRender,
      showMain: () => this.showMain(),
      showError: ({ title, description }: { title: string; description: string }) =>
        this.renderError({ title, description }),
      showException: (err: Error) => this.renderException(err),
    };
    return { metadata, context };
  }

  async renderStoryIfChanged({
    metadata,
    context,
  }: {
    metadata: RenderMetadata;
    context: RenderContextWithoutStoryContext;
  }) {
    const { forceRender, name } = context;

    const { previousMetadata, storyStore } = this;

    const storyChanged = !previousMetadata || previousMetadata.id !== metadata.id;
    // getDecorated is a function that returns a decorated story function. It'll change whenever the story
    // is reloaded into the store, which means the module the story was defined in was HMR-ed.
    const implementationChanged =
      !previousMetadata || previousMetadata.getDecorated !== metadata.getDecorated;
    const viewModeChanged = !previousMetadata || previousMetadata.viewMode !== metadata.viewMode;
    const kindChanged = !previousMetadata || previousMetadata.kind !== metadata.kind;

    // Don't re-render the story if nothing has changed to justify it
    if (!forceRender && !storyChanged && !implementationChanged && !viewModeChanged) {
      this.channel.emit(Events.STORY_UNCHANGED, {
        ...metadata,
        name,
      });
      return;
    }

    // If we are rendering something new (as opposed to re-rendering the same or first story), emit
    if (previousMetadata && (storyChanged || kindChanged || viewModeChanged)) {
      this.channel.emit(Events.STORY_CHANGED, metadata.id);
    }

    switch (previousMetadata ? previousMetadata.viewMode : 'story') {
      case 'docs':
        if (kindChanged || viewModeChanged) {
          this.storyStore.cleanHooksForKind(previousMetadata.kind);
          // debugger;
          ReactDOM.unmountComponentAtNode(document.getElementById('docs-root'));
        }
        break;
      case 'story':
      default:
        if (previousMetadata && (storyChanged || viewModeChanged)) {
          this.storyStore.cleanHooks(previousMetadata.id);
          // debugger;
          ReactDOM.unmountComponentAtNode(document.getElementById('root'));
        }
    }

    // Docs view renders into a different root ID to avoid conflicts
    // with the user's view layer. Therefore we need to clean up whenever
    // we transition between view modes
    if (viewModeChanged) {
      switch (metadata.viewMode) {
        case 'docs': {
          this.showMain();
          this.showDocs();
          break;
        }
        case 'story':
        default: {
          if (previousMetadata) {
            this.showStory();
          }
        }
      }
    }
    // Given a cleaned up state, render the appropriate view mode
    switch (metadata.viewMode) {
      case 'docs': {
        this.renderDocs({ context, storyStore });
        break;
      }
      case 'story':
      default: {
        await this.renderStory({ context });
        break;
      }
    }

    this.previousMetadata = metadata;

    if (!forceRender && metadata.viewMode !== 'docs') {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }
  }

  applyLayout(layout: Layout = 'padded') {
    if (layout === 'none') {
      document.body.classList.remove(this.previousLayoutClass);
      this.previousLayoutClass = null;
      return;
    }

    this.checkIfLayoutExists(layout);

    const layoutClass = layoutClassMap[layout];

    document.body.classList.remove(this.previousLayoutClass);
    document.body.classList.add(layoutClass);
    this.previousLayoutClass = layoutClass;
  }

  checkIfLayoutExists(layout: keyof typeof layoutClassMap) {
    if (!layoutClassMap[layout]) {
      logger.warn(
        dedent`The desired layout: ${layout} is not a valid option.
         The possible options are: ${Object.keys(layoutClassMap).join(', ')}, none.`
      );
    }
  }

  showErrorDisplay({ message = '', stack = '' }) {
    document.getElementById('error-message').innerHTML = ansiConverter.toHtml(message);
    document.getElementById('error-stack').innerHTML = ansiConverter.toHtml(stack);

    document.body.classList.remove(classes.MAIN);
    document.body.classList.remove(classes.NOPREVIEW);

    document.body.classList.add(classes.ERROR);
  }

  showNoPreview() {
    document.body.classList.remove(classes.MAIN);
    document.body.classList.remove(classes.ERROR);

    document.body.classList.add(classes.NOPREVIEW);
  }

  showMain() {
    document.body.classList.remove(classes.NOPREVIEW);
    document.body.classList.remove(classes.ERROR);

    document.body.classList.add(classes.MAIN);
  }

  showDocs() {
    document.getElementById('root').setAttribute('hidden', 'true');
    document.getElementById('docs-root').removeAttribute('hidden');
  }

  showStory() {
    document.getElementById('docs-root').setAttribute('hidden', 'true');
    document.getElementById('root').removeAttribute('hidden');
  }

  async renderStory({
    context,
    context: { id, getDecorated },
  }: {
    context: RenderContextWithoutStoryContext;
  }) {
    if (getDecorated) {
      try {
        const { applyLoaders, runPlayFunction, unboundStoryFn, forceRender } = context;
        const storyContext = await applyLoaders();
        const storyFn = () => unboundStoryFn(storyContext);
        await this.render({ ...context, storyContext, storyFn });
        if (isCsf3Enabled() && !forceRender) {
          await runPlayFunction();
        }
        this.channel.emit(Events.STORY_RENDERED, id);
      } catch (err) {
        this.renderException(err);
      }
    } else {
      this.showNoPreview();
      this.channel.emit(Events.STORY_MISSING, id);
    }
  }

  renderDocs({
    context,
    storyStore,
  }: {
    context: RenderContextWithoutStoryContext;
    storyStore: StoryStore;
  }) {
    const { kind, parameters, id } = context;
    if (id === '*' || !parameters) {
      return;
    }

    const docs = parameters.docs || {};
    if (docs.page && !docs.container) {
      throw new Error('No `docs.container` set, did you run `addon-docs/preset`?');
    }

    // console.log('renderDocs', { context });

    const DocsContainer =
      docs.container || (({ children }: { children: Element }) => <>{children}</>);
    const Page = docs.page || NoDocs;
    // Docs context includes the storyStore. Probably it would be better if it didn't but that can be fixed in a later refactor
    ReactDOM.render(
      <DocsContainer context={{ storyStore, ...context, channel: this.channel }}>
        <Page />
      </DocsContainer>,
      document.getElementById('docs-root'),
      () => this.channel.emit(Events.DOCS_RENDERED, kind)
    );
  }

  // renderException is used if we fail to render the story and it is uncaught by the app layer
  renderException(err: Error) {
    this.channel.emit(Events.STORY_THREW_EXCEPTION, err);
    this.showErrorDisplay(err);

    // Log the stack to the console. So, user could check the source code.
    logger.error(err);
  }

  // renderError is used by the various app layers to inform the user they have done something
  // wrong -- for instance returned the wrong thing from a story
  renderError({ title, description }: { title: string; description: string }) {
    this.channel.emit(Events.STORY_ERRORED, { title, description });
    this.showErrorDisplay({
      message: title,
      stack: description,
    });
  }
}
