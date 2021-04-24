import { document } from 'global';
/** @jsx m */

import m from 'mithril';
import dedent from 'ts-dedent';

import { RenderContext } from './types';

const rootEl = document.getElementById('storybook-root');

export default function renderMain({ storyFn, kind, name, showMain, showError }: RenderContext) {
  const element = storyFn();

  if (!element) {
    const error = {
      title: `Expecting a Mithril element from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Mithril element from the story?
        Use "() => MyComp" or "() => { return MyComp; }" when defining the story.
      `,
    };
    showError(error);
    return;
  }

  showMain();
  m.mount(rootEl, { view: () => m(element) });
}
