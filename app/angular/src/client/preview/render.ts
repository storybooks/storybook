import { StoryFn } from '@storybook/addons';

import { renderNgApp } from './angular/helpers';
import { StoryFnAngularReturnType } from './types';
import { Parameters } from './types-6-0';

import { RendererFactory } from './angular-beta/RendererFactory';

const rootElement = global.document.getElementById('root');

const rendererFactory = new RendererFactory();

export default async function renderMain({
  storyFn,
  forceRender,
  parameters,
  targetDOMNode = rootElement,
  id,
}: {
  storyFn: StoryFn<StoryFnAngularReturnType>;
  showMain: () => void;
  forceRender: boolean;
  parameters: Parameters;
  targetDOMNode: HTMLElement;
  id: string;
}) {
  if (parameters.angularLegacyRendering) {
    renderNgApp(storyFn, forceRender);
    return;
  }

  const renderer = await rendererFactory.getRendererInstance(id, targetDOMNode);

  await renderer.render({
    storyFnAngular: storyFn(),
    parameters,
    forced: forceRender,
    targetDOMNode,
  });
}
