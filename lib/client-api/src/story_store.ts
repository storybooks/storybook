/* eslint no-underscore-dangle: 0 */
import memoize from 'memoizerific';
import dedent from 'ts-dedent';
import stable from 'stable';
import mapValues from 'lodash/mapValues';

import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import {
  StoryId,
  ViewMode,
  Comparator,
  Parameters,
  Args,
  LegacyStoryFn,
  ArgsStoryFn,
  StoryContext,
  StoryKind,
} from '@storybook/addons';
import {
  DecoratorFunction,
  StoryMetadata,
  StoreData,
  AddStoryArgs,
  StoreItem,
  PublishedStoreItem,
  ErrorLike,
  GetStorybookKind,
  ComponentArgTypesEnhancer,
  StoryArgTypesEnhancer,
} from './types';
import { HooksContext } from './hooks';
import storySort from './storySort';
import { combineParameters } from './parameters';

interface Selection {
  storyId: StoryId;
  viewMode: ViewMode;
}

interface StoryOptions {
  includeDocsOnly?: boolean;
}

type KindMetadata = StoryMetadata & { order: number; enhanced?: boolean };

const isStoryDocsOnly = (parameters?: Parameters) => {
  return parameters && parameters.docsOnly;
};

const includeStory = (story: StoreItem, options: StoryOptions = { includeDocsOnly: false }) => {
  if (options.includeDocsOnly) {
    return true;
  }
  return !isStoryDocsOnly(story.parameters);
};

const checkGlobalArgs = (parameters: Parameters) => {
  const { globalArgs, globalArgTypes } = parameters;
  if (globalArgs || globalArgTypes) {
    logger.error(
      'Global args/argTypes can only be set globally',
      JSON.stringify({
        globalArgs,
        globalArgTypes,
      })
    );
  }
};

const checkStorySort = (parameters: Parameters) => {
  const { options } = parameters;
  if (options?.storySort) logger.error('The storySort option parameter can only be set globally');
};

interface AllowUnsafeOption {
  allowUnsafe?: boolean;
}

const toExtracted = <T>(obj: T) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      return acc;
    }
    if (key === 'hooks') {
      return acc;
    }
    if (Array.isArray(value)) {
      return Object.assign(acc, { [key]: value.slice().sort() });
    }
    return Object.assign(acc, { [key]: value });
  }, {});

export default class StoryStore {
  _error?: ErrorLike;

  _channel: Channel;

  _configuring: boolean;

  _globalArgs: Args;

  _globalMetadata: StoryMetadata;

  // Keyed on kind name
  _kinds: Record<string, KindMetadata>;

  // Keyed on storyId
  _stories: StoreData;

  _componentArgTypesEnhancers: ComponentArgTypesEnhancer[];

  _storyArgTypesEnhancers: StoryArgTypesEnhancer[];

  _selection: Selection;

  constructor(params: { channel: Channel }) {
    // Assume we are configuring until we hear otherwise
    this._configuring = true;

    this._globalArgs = {};
    this._globalMetadata = { parameters: {}, decorators: [] };
    this._kinds = {};
    this._stories = {};
    this._componentArgTypesEnhancers = [];
    this._storyArgTypesEnhancers = [];
    this._selection = {} as any;
    this._error = undefined;
    this._channel = params.channel;

    this.setupListeners();
  }

  setupListeners() {
    // Channel can be null in StoryShots
    if (!this._channel) return;

    this._channel.on(Events.SET_CURRENT_STORY, ({ storyId, viewMode }) =>
      this.setSelection({ storyId, viewMode })
    );

    this._channel.on(Events.UPDATE_STORY_ARGS, (id: string, newArgs: Args) =>
      this.updateStoryArgs(id, newArgs)
    );

    this._channel.on(Events.UPDATE_GLOBAL_ARGS, (newGlobalArgs: Args) =>
      this.updateGlobalArgs(newGlobalArgs)
    );
  }

  startConfiguring() {
    this._configuring = true;
  }

  finishConfiguring() {
    this._configuring = false;

    const { globalArgs: initialGlobalArgs, globalArgTypes } = this._globalMetadata.parameters;

    const defaultGlobalArgs: Args = globalArgTypes
      ? Object.entries(globalArgTypes as Record<string, { defaultValue: any }>).reduce(
          (acc, [arg, { defaultValue }]) => {
            if (defaultValue) acc[arg] = defaultValue;
            return acc;
          },
          {} as Args
        )
      : {};

    // To deal with HMR, we consider the previous value of global args, and:
    //   1. Remove any keys that are not in the new parameter
    //   2. Preference any keys that were already set
    //   3. Use any new keys from the new parameter
    this._globalArgs = Object.entries(this._globalArgs || {}).reduce(
      (acc, [key, previousValue]) => {
        if (acc[key]) acc[key] = previousValue;

        return acc;
      },
      { ...defaultGlobalArgs, ...initialGlobalArgs }
    );

    this.pushToManager();
    if (this._channel) {
      this._channel.emit(Events.RENDER_CURRENT_STORY);
    }
  }

  addGlobalMetadata({ parameters, decorators }: StoryMetadata) {
    if (parameters) {
      const { args, argTypes } = parameters;
      if (args || argTypes)
        logger.warn(
          'Found args/argTypes in global parameters.',
          JSON.stringify({ args, argTypes })
        );
    }
    const globalParameters = this._globalMetadata.parameters;

    this._globalMetadata.parameters = combineParameters(globalParameters, parameters);

    this._globalMetadata.decorators.push(...decorators);
  }

  clearGlobalDecorators() {
    this._globalMetadata.decorators = [];
  }

  ensureKind(kind: string) {
    if (!this._kinds[kind]) {
      this._kinds[kind] = {
        order: Object.keys(this._kinds).length,
        parameters: {},
        decorators: [],
      };
    }
  }

  enhanceKindArgTypes(kind: string) {
    this.ensureKind(kind);
    const kindData = this._kinds[kind];
    if (kindData.enhanced) {
      return;
    }

    const { argTypes = {} } = this._componentArgTypesEnhancers.reduce(
      (accumulatedParameters: Parameters, enhancer) => ({
        ...accumulatedParameters,
        argTypes: enhancer({
          ...kindData,
          kind,
          parameters: accumulatedParameters,
          args: {},
          // FIXME: fix types, drop these
          id: '',
          name: '',
          globalArgs: {},
        }),
      }),
      { ...kindData.parameters }
    );

    kindData.parameters.argTypes = argTypes;
    kindData.enhanced = true;
  }

  addKindMetadata(kind: string, { parameters, decorators }: StoryMetadata) {
    this.ensureKind(kind);
    if (parameters) {
      checkGlobalArgs(parameters);
      checkStorySort(parameters);
    }
    this._kinds[kind].parameters = combineParameters(this._kinds[kind].parameters, parameters);

    this._kinds[kind].decorators.push(...decorators);
  }

  addComponentArgTypesEnhancer(argTypesEnhancer: ComponentArgTypesEnhancer) {
    if (Object.keys(this._stories).length > 0)
      throw new Error('Cannot add an argTypes enhancer to the store after a story has been added.');

    this._componentArgTypesEnhancers.push(argTypesEnhancer);
  }

  addStoryArgTypesEnhancer(argTypesEnhancer: StoryArgTypesEnhancer) {
    if (Object.keys(this._stories).length > 0)
      throw new Error('Cannot add an argTypes enhancer to the store after a story has been added.');

    this._storyArgTypesEnhancers.push(argTypesEnhancer);
  }

  // Combine the global, kind & story parameters of a story
  combineStoryParameters(parameters: Parameters, kind: StoryKind) {
    return combineParameters(
      this._globalMetadata.parameters,
      this._kinds[kind].parameters,
      parameters
    );
  }

  addStory(
    {
      id,
      kind,
      name,
      storyFn: original,
      parameters: storyParameters = {},
      decorators: storyDecorators = [],
    }: AddStoryArgs,
    {
      applyDecorators,
      allowUnsafe = false,
    }: {
      applyDecorators: (fn: LegacyStoryFn, decorators: DecoratorFunction[]) => any;
    } & AllowUnsafeOption
  ) {
    if (!this._configuring && !allowUnsafe)
      throw new Error(
        'Cannot add a story when not configuring, see https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#story-store-immutable-outside-of-configuration'
      );

    if (storyParameters) {
      checkGlobalArgs(storyParameters);
      checkStorySort(storyParameters);
    }

    const { _stories } = this;

    if (_stories[id]) {
      logger.warn(dedent`
        Story with id ${id} already exists in the store!

        Perhaps you added the same story twice, or you have a name collision?
        Story ids need to be unique -- ensure you aren't using the same names modulo url-sanitization.
      `);
    }

    const identification = {
      id,
      kind,
      name,
      story: name, // legacy
    };

    // immutable original storyFn
    const getOriginal = () => original;

    this.enhanceKindArgTypes(kind);
    const kindMetadata: KindMetadata = this._kinds[kind];
    const decorators = [
      ...storyDecorators,
      ...kindMetadata.decorators,
      ...this._globalMetadata.decorators,
    ];

    const finalStoryFn = (context: StoryContext) => {
      const { passArgsFirst } = context.parameters;
      return passArgsFirst || typeof passArgsFirst === 'undefined'
        ? (original as ArgsStoryFn)(context.args, context)
        : original(context);
    };

    // lazily decorate the story when it's loaded
    const getDecorated: () => LegacyStoryFn = memoize(1)(() =>
      applyDecorators(finalStoryFn, decorators)
    );

    const hooks = new HooksContext();

    // We need the combined parameters now in order to calculate argTypes, but we won't keep them
    const combinedParameters = this.combineStoryParameters(storyParameters, kind);

    const { argTypes = {} } = this._storyArgTypesEnhancers.reduce(
      (accumlatedParameters: Parameters, enhancer) => ({
        ...accumlatedParameters,
        argTypes: enhancer({
          ...identification,
          storyFn: original,
          parameters: accumlatedParameters,
          args: {},
          globalArgs: {},
        }),
      }),
      combinedParameters
    );

    const storyParametersWithArgTypes = { ...storyParameters, argTypes };

    const storyFn: LegacyStoryFn = (runtimeContext: StoryContext) =>
      getDecorated()({
        ...identification,
        ...runtimeContext,
        // Calculate "combined" parameters at render time (NOTE: for perf we could just use combinedParameters from above?)
        parameters: this.combineStoryParameters(storyParametersWithArgTypes, kind),
        hooks,
        args: _stories[id].args,
        globalArgs: this._globalArgs,
      });

    // Pull out parameters.args.$ || .argTypes.$.defaultValue into initialArgs
    const initialArgs: Args = combinedParameters.args;
    const defaultArgs: Args = Object.entries(
      argTypes as Record<string, { defaultValue: any }>
    ).reduce((acc, [arg, { defaultValue }]) => {
      if (defaultValue) acc[arg] = defaultValue;
      return acc;
    }, {} as Args);

    _stories[id] = {
      ...identification,

      hooks,
      getDecorated,
      getOriginal,
      storyFn,

      parameters: { ...storyParameters, argTypes },
      args: { ...defaultArgs, ...initialArgs },
    };
  }

  remove = (id: string, { allowUnsafe = false }: AllowUnsafeOption = {}): void => {
    if (!this._configuring && !allowUnsafe)
      throw new Error(
        'Cannot remove a story when not configuring, see https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#story-store-immutable-outside-of-configuration'
      );

    const { _stories } = this;
    const story = _stories[id];
    delete _stories[id];

    if (story) story.hooks.clean();
  };

  removeStoryKind(kind: string, { allowUnsafe = false }: AllowUnsafeOption = {}) {
    if (!this._configuring && !allowUnsafe)
      throw new Error(
        'Cannot remove a kind when not configuring, see https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#story-store-immutable-outside-of-configuration'
      );

    if (!this._kinds[kind]) return;

    this._kinds[kind].parameters = {};
    this._kinds[kind].decorators = [];
    this._kinds[kind].enhanced = false;

    this.cleanHooksForKind(kind);
    this._stories = Object.entries(this._stories).reduce((acc: StoreData, [id, story]) => {
      if (story.kind !== kind) acc[id] = story;

      return acc;
    }, {});
  }

  updateGlobalArgs(newGlobalArgs: Args) {
    this._globalArgs = { ...this._globalArgs, ...newGlobalArgs };
    this._channel.emit(Events.GLOBAL_ARGS_UPDATED, this._globalArgs);
  }

  updateStoryArgs(id: string, newArgs: Args) {
    if (!this._stories[id]) throw new Error(`No story for id ${id}`);
    const { args } = this._stories[id];
    this._stories[id].args = { ...args, ...newArgs };

    this._channel.emit(Events.STORY_ARGS_UPDATED, id, this._stories[id].args);
  }

  fromId = (id: string): PublishedStoreItem | null => {
    try {
      const data = this._stories[id as string];

      if (!data || !data.getDecorated) {
        return null;
      }

      return this.mergeAdditionalDataToStory(data);
    } catch (e) {
      logger.warn('failed to get story:', this._stories);
      logger.error(e);
      return null;
    }
  };

  raw(options?: StoryOptions): PublishedStoreItem[] {
    return Object.values(this._stories)
      .filter((i) => !!i.getDecorated)
      .filter((i) => includeStory(i, options))
      .map((i) => this.mergeAdditionalDataToStory(i));
  }

  extract(options: StoryOptions & { normalizeParameters?: boolean } = {}) {
    const stories = Object.entries(this._stories);

    const storySortParameter = this._globalMetadata.parameters?.options?.storySort;
    if (storySortParameter) {
      let sortFn: Comparator<any>;
      if (typeof storySortParameter === 'function') {
        sortFn = storySortParameter;
      } else {
        sortFn = storySort(storySortParameter);
      }
      stable.inplace(stories, sortFn);
    } else {
      // NOTE: when kinds are HMR'ed they get temporarily removed from the `_stories` array
      // and thus lose order. However `_kindOrder` preservers the original load order
      stable.inplace(
        stories,
        (s1, s2) => this._kinds[s1[1].kind].order - this._kinds[s2[1].kind].order
      );
    }

    // removes function values from all stories so they are safe to transport over the channel
    return stories.reduce((acc, [id, story]) => {
      if (!includeStory(story, options)) return acc;

      const extracted = toExtracted(story);
      if (options.normalizeParameters) return Object.assign(acc, { [id]: extracted });

      const { parameters, kind } = extracted as {
        parameters: Parameters;
        kind: StoryKind;
      };
      return Object.assign(acc, {
        [id]: Object.assign(extracted, {
          parameters: this.combineStoryParameters(parameters, kind),
        }),
      });
    }, {});
  }

  clearError() {
    this._error = null;
  }

  setError = (err: ErrorLike) => {
    this._error = err;
  };

  getError = (): ErrorLike | undefined => this._error;

  setSelection(selection: Selection): void {
    this._selection = selection;

    if (this._channel) {
      this._channel.emit(Events.CURRENT_STORY_WAS_SET, this._selection);

      // If the selection is set while configuration is in process, we are guaranteed
      // we'll emit RENDER_CURRENT_STORY at the end of the process, so we shouldn't do it now.
      if (!this._configuring) {
        this._channel.emit(Events.RENDER_CURRENT_STORY);
      }
    }
  }

  getSelection = (): Selection => this._selection;

  getDataForManager = () => {
    return {
      v: 2,
      globalParameters: this._globalMetadata.parameters,
      globalArgs: this._globalArgs,
      error: this.getError(),
      kindParameters: mapValues(this._kinds, (metadata) => metadata.parameters),
      stories: this.extract({ includeDocsOnly: true, normalizeParameters: true }),
    };
  };

  pushToManager = () => {
    if (this._channel) {
      // send to the parent frame.
      this._channel.emit(Events.SET_STORIES, this.getDataForManager());
    }
  };

  getStoryKinds() {
    return Array.from(new Set(this.raw().map((s) => s.kind)));
  }

  getStoriesForKind(kind: string) {
    return this.raw().filter((story) => story.kind === kind);
  }

  getRawStory(kind: string, name: string) {
    return this.getStoriesForKind(kind).find((s) => s.name === name);
  }

  cleanHooks(id: string) {
    if (this._stories[id]) {
      this._stories[id].hooks.clean();
    }
  }

  cleanHooksForKind(kind: string) {
    this.getStoriesForKind(kind).map((story) => this.cleanHooks(story.id));
  }

  // This API is a reimplementation of Storybook's original getStorybook() API.
  // As such it may not behave *exactly* the same, but aims to. Some notes:
  //  - It is *NOT* sorted by the user's sort function, but remains sorted in "insertion order"
  //  - It does not include docs-only stories
  getStorybook(): GetStorybookKind[] {
    return Object.values(
      this.raw().reduce((kinds: { [kind: string]: GetStorybookKind }, story) => {
        if (!includeStory(story)) return kinds;

        const {
          kind,
          name,
          storyFn,
          parameters: { fileName },
        } = story;

        // eslint-disable-next-line no-param-reassign
        if (!kinds[kind]) kinds[kind] = { kind, fileName, stories: [] };

        kinds[kind].stories.push({ name, render: storyFn });

        return kinds;
      }, {})
    ).sort((s1, s2) => this._kinds[s1.kind].order - this._kinds[s2.kind].order);
  }

  private mergeAdditionalDataToStory(story: StoreItem): PublishedStoreItem {
    return {
      ...story,
      parameters: this.combineStoryParameters(story.parameters, story.kind),
      globalArgs: this._globalArgs,
    };
  }
}
