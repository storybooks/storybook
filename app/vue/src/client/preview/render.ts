import dedent from 'ts-dedent';
import Vue from 'vue';
import { RenderContext } from './types';

export const COMPONENT = 'STORYBOOK_COMPONENT';
export const VALUES = 'STORYBOOK_VALUES';

const root = new Vue({
  data() {
    return {
      [COMPONENT]: undefined,
      [VALUES]: {},
    };
  },
  render(h) {
    const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
    return h('div', { attrs: { id: 'storybook-root' } }, children);
  },
});

export default function render({
  storyFn,
  kind,
  name,
  args,
  showMain,
  showError,
  showException,
  forceRender,
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

  showMain();

  // at component creation || refresh by HMR or switching stories
  if (!root[COMPONENT] || !forceRender) {
    root[COMPONENT] = element;
  }

  // @ts-ignore https://github.com/storybookjs/storrybook/pull/7578#discussion_r307986139
  root[VALUES] = { ...element.options[VALUES], ...args };

  if (!root.$el) {
    root.$mount('#storybook-root');
  }
}
