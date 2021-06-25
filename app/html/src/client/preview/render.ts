import global from 'global';
import dedent from 'ts-dedent';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/client-api';
import { RenderContext } from './types';

const { document, Node } = global;
const rootElement = document.getElementById('root');

export default function renderMain({
  storyFn,
  kind,
  name,
  showError,
  forceRender,
  targetDOMNode = rootElement,
}: RenderContext) {
  const element = storyFn();
  if (typeof element === 'string') {
    targetDOMNode.innerHTML = element;
    simulatePageLoad(targetDOMNode);
  } else if (element instanceof Node) {
    // Don't re-mount the element if it didn't change and neither did the story
    if (targetDOMNode.firstChild === element && forceRender === true) {
      return;
    }

    targetDOMNode.innerHTML = '';
    targetDOMNode.appendChild(element);
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
