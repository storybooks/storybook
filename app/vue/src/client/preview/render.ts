import dedent from 'ts-dedent';
import Vue from 'vue';
import { RenderContext } from './types';

export const COMPONENT = 'STORYBOOK_COMPONENT';
export const VALUES = 'STORYBOOK_VALUES';

const rootElement = global.document.getElementById('root');

const root = new Vue({
  data() {
    return {
      [COMPONENT]: undefined,
      [VALUES]: {},
    };
  },
  render(h) {
    const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
    return h('div', { attrs: { id: 'root' } }, children);
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
  Vue.config.errorHandler = showException;

  // FIXME: move this into root[COMPONENT] = element
  // once we get rid of knobs so we don't have to re-create
  // a new component each time
  const element = storyFn();

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

  if (!root.$el) {
    // at component creation || refresh by HMR or switching stories
    if (!root[COMPONENT] || !forceRender) {
      root[COMPONENT] = element;
    }

    // @ts-ignore https://github.com/storybookjs/storrybook/pull/7578#discussion_r307986139
    root[VALUES] = { ...element.options[VALUES], ...args };

    root.$mount(rootElement);
  }

  if (targetDOMNode.id === 'root') {
    // at component creation || refresh by HMR or switching stories
    if (!root[COMPONENT] || !forceRender) {
      root[COMPONENT] = element;
    }

    // @ts-ignore https://github.com/storybookjs/storrybook/pull/7578#discussion_r307986139
    root[VALUES] = { ...element.options[VALUES], ...args };
  } else {
    const component = storyFn();

    // eslint-disable-next-line no-new
    new Vue({
      el: targetDOMNode,
      data() {
        return {
          [COMPONENT]: component,
          [VALUES]: args,
        };
      },
      render(h) {
        const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
        return h('div', { attrs: { id: 'root' } }, children);
      },
    });
  }
}
