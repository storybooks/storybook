import root from '@storybook/global-root';
import PreviewRender from './PreviewRender.svelte';
import { RenderContext } from './types';

const { document } = root;

type Component = any;

let previousComponent: Component = null;

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }
  previousComponent.$destroy();
  previousComponent = null;
}

export default function render({ storyFn, kind, name, showMain, showError }: RenderContext) {
  cleanUpPreviousStory();

  const target = document.getElementById('root');

  target.innerHTML = '';

  previousComponent = new PreviewRender({
    target,
    props: {
      storyFn,
      name,
      kind,
      showError,
    },
  });

  showMain();
}
