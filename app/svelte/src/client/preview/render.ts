import { document } from 'global';
import { RenderContext } from './types';
import PreviewRender from './PreviewRender.svelte';

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

  const target = document.getElementById('storybook-root');

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
