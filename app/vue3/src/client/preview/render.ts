/* eslint-disable no-param-reassign */
import dedent from 'ts-dedent';
import { createApp, h, shallowRef, ComponentPublicInstance, render } from 'vue';
import { Args } from '@storybook/addons';
import { RenderContext, StoryFnVueReturnType } from './types';

const activeStoryComponent = shallowRef<StoryFnVueReturnType | null>(null);
const rootElement = global.document.getElementById('root');

interface Root extends ComponentPublicInstance {
  storyArgs?: Args;
}

let root: Root | null = null;

export const storybookApp = createApp({
  // If an end-user calls `unmount` on the app, we need to clear our root variable
  unmounted() {
    root = null;
  },

  data() {
    return {
      storyArgs: undefined,
    };
  },

  setup() {
    return () => {
      if (!activeStoryComponent.value)
        throw new Error('No Vue 3 Story available. Was it set correctly?');
      return h(activeStoryComponent.value);
    };
  },
});

export default function renderMain({
  storyFn,
  kind,
  name,
  args,
  showError,
  showException,
  forceRender,
  targetDOMNode = rootElement,
}: RenderContext) {
  storybookApp.config.errorHandler = showException;

  const element: StoryFnVueReturnType = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  if (!root) {
    if (!forceRender) {
      activeStoryComponent.value = element;
    }
    root = storybookApp.mount(`#root`);
  }

  if (targetDOMNode.id === 'root') {
    activeStoryComponent.value = element;
  } else {
    const vnode = h(element, args);
    // By attaching the app context from `@storybook/vue3` to the vnode
    // like this, these stoeis are able to access any app config stuff
    // the end-user set inside `.storybook/preview.js`
    vnode.appContext = storybookApp._context; // eslint-disable-line no-underscore-dangle

    targetDOMNode.innerHTML = '';
    render(vnode, targetDOMNode);
  }

  root.storyArgs = args;
}
