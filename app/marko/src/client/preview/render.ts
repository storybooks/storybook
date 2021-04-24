import { document } from 'global';
import dedent from 'ts-dedent';

import { logger } from '@storybook/client-logger';

const rootEl = document.getElementById('storybook-root');
let activeComponent: any = null; // currently loaded marko component.
let activeTemplate: any = null; // template for the currently loaded component.
let activeStoryFn: any = null; // used to determine if we've switched stories.

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  parameters,
}: // forceRender,
{
  storyFn: Function;
  kind: string;
  name: string;
  showMain: () => any;
  showError: (input: { title: string; description: string }) => void;
  parameters: any;
}) {
  const isSameStory = activeStoryFn === storyFn;
  const config = storyFn();
  activeStoryFn = storyFn;

  if (!config || !(config.appendTo || config.component || parameters.component)) {
    showError({
      title: `Expecting an object with a component property to be returned from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the component from the story?
        Use "() => ({ component: MyComponent, input: { hello: 'world' } })" when defining the story.
      `,
    });

    return;
  }
  if (config.appendTo) {
    logger.warn(
      '@storybook/marko: returning a rendered component for a story is deprecated, return an object with `{ component, input }` instead.'
    );

    // The deprecated API always destroys the previous component instance.
    if (activeComponent) {
      activeComponent.destroy();
    }

    activeComponent = config.appendTo(rootEl).getComponent();
  } else {
    const template = config.component || parameters.component;

    if (isSameStory && activeTemplate === template) {
      // When rendering the same template with new input, we reuse the same instance.
      activeComponent.input = config.input;
      activeComponent.update();
    } else {
      if (activeComponent) {
        activeComponent.destroy();
      }

      activeTemplate = template;
      activeComponent = activeTemplate.renderSync(config.input).appendTo(rootEl).getComponent();
    }
  }

  showMain();
}
