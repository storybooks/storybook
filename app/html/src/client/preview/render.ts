import { document, Node } from 'global';
import dedent from 'ts-dedent';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/client-api';
import { RenderContext } from './types';

const rootElement = document.getElementById('storybook-root');

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
  forceRender,
}: RenderContext) {
  const element = storyFn();
  showMain();
  if (typeof element === 'string') {
    rootElement.innerHTML = element;
    simulatePageLoad(rootElement);
  } else if (element instanceof Node) {
    // Don't re-mount the element if it didn't change and neither did the story
    if (rootElement.firstChild === element && forceRender === true) {
      return;
    }

    rootElement.innerHTML = '';
    rootElement.appendChild(element);
    simulateDOMContentLoaded();
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM node from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}
