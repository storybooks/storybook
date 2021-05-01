import { PartialStoryFn } from '@storybook/addons';
import { RendererService } from './angular-beta/RendererService';

import { renderNgApp } from './angular/helpers';
import { StoryFnAngularReturnType } from './types';
import { Parameters } from './types-6-0';

// add proper types
export default function render({
  storyFn,
  showMain,
  forceRender,
  parameters,
}: {
  storyFn: PartialStoryFn<StoryFnAngularReturnType>;
  showMain: () => void;
  forceRender: boolean;
  parameters: Parameters;
}) {
  showMain();

  if (parameters.angularLegacyRendering) {
    renderNgApp(storyFn, forceRender);
    return;
  }

  RendererService.getInstance().render({
    storyFnAngular: storyFn(),
    parameters,
    forced: forceRender,
  });
}
