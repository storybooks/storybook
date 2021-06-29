import root from '@storybook/global-root';
import * as preact from 'preact';
import dedent from 'ts-dedent';
import { RenderContext, StoryFnPreactReturnType } from './types';

const { document } = root;

const rootElement = document ? document.getElementById('root') : null;

let renderedStory: Element;

function preactRender(story: StoryFnPreactReturnType): void {
  if (preact.Fragment) {
    // Preact 10 only:
    preact.render(story, rootElement);
  } else {
    renderedStory = (preact.render(story, rootElement, renderedStory) as unknown) as Element;
  }
}

const StoryHarness: preact.FunctionalComponent<{
  name: string;
  kind: string;
  showError: RenderContext['showError'];
  storyFn: () => any;
}> = ({ showError, name, kind, storyFn }) => {
  const content = preact.h(storyFn as any, null);
  if (!content) {
    showError({
      title: `Expecting a Preact element from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Preact element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return null;
  }
  return content;
};

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  forceRender,
}: RenderContext) {
  // But forceRender means that it's the same story, so we want to keep the state in that case.
  if (!forceRender) {
    preactRender(null);
  }

  showMain();

  preactRender(preact.h(StoryHarness, { name, kind, showError, storyFn }));
}
