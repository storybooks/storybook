import global from 'global';
import { RenderContext } from './types';
import PreviewRender from './PreviewRender.svelte';

const { document } = global;

type Component = any;

let previousComponent: Component = null;
const rootElement = document.getElementById('root');

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }
  try {
    previousComponent.$destroy();
  } catch (e) {
    //
  }
  previousComponent = null;
}

export default function renderMain({
  storyFn,
  kind,
  name,
  showError,
  targetDOMNode = rootElement,
}: RenderContext) {
  cleanUpPreviousStory();

  // targetDOMNode.innerHTML = '';

  if (targetDOMNode === rootElement) {
    previousComponent = new PreviewRender({
      targetDOMNode,
      props: {
        storyFn,
        name,
        kind,
        showError,
      },
    });
  } else {
    // eslint-disable-next-line no-new
    new PreviewRender({
      targetDOMNode,
      props: {
        storyFn,
        name,
        kind,
        showError,
      },
    });
  }
}
