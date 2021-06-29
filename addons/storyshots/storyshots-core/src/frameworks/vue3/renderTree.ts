import * as Vue from 'vue';
import root from '@storybook/global-root';
import dedent from 'ts-dedent';

// This is cast as `any` to workaround type errors caused by Vue 2 types
const { render, h } = Vue as any;

function getRenderedTree(story: any) {
  const component = story.render();

  const vnode = h(component, story.args);

  // Vue 3's Jest renderer throws if all of the required props aren't specified
  // So we try/catch and warn the user if they forgot to specify one in their args
  try {
    render(vnode, root.document.createElement('div'));
  } catch (err) {
    // Jest throws an error when you call `console.error`
    // eslint-disable-next-line no-console
    console.error(
      dedent`
        Storyshots encountered an error while rendering Vue 3 story: ${story.id}
        Did you remember to define every prop you are using in the story?
      `
    );
  }

  return vnode.el;
}

export default getRenderedTree;
