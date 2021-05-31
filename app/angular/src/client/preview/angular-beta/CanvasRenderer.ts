import { AbstractRenderer } from './AbstractRenderer';
import { StoryFnAngularReturnType } from '../types';
import { Parameters } from '../types-6-0';

export class CanvasRenderer extends AbstractRenderer {
  public async render(options: {
    storyFnAngular: StoryFnAngularReturnType;
    forced: boolean;
    parameters: Parameters;
    targetDOMNode: HTMLElement;
  }) {
    await super.render(options).then(async () => {
      await CanvasRenderer.resetCompiledComponents();
    });
  }

  async beforeFullRender(): Promise<void> {
    await CanvasRenderer.resetPlatformBrowserDynamic();
  }
}
