import { document } from 'global';
import dedent from 'ts-dedent';

import { renderVdom, registerHost, getHostRef } from '@stencil/core/internal/client';
import { RenderContext } from './types';

const rootElement = document.getElementById('root');
registerHost(rootElement, { $flags$: 0, $tagName$: 'story-root' });
const hostRef = getHostRef(rootElement);

export default function renderMain({
  storyFn,
  showMain,
  forceRender,
  showError,
  kind,
  name,
}: RenderContext) {
  const element = storyFn();

  showMain();

  if (typeof (element as any).$tag$ === 'string') {
    if (!forceRender) {
      renderVdom(hostRef, undefined);
    }

    renderVdom(hostRef, element);
  } else {
    showError({
      title: `Expecting a JSX snippet from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the jsx snippet from the story?
        Use "() => <your-custom-element />" or when defining the story.
      `,
    });
  }
}
