import { PlatformRef } from '@angular/core';
import { AbstractRenderer } from './AbstractRenderer';
import { DocsRenderer } from './DocsRenderer';
import { CanvasRenderer } from './CanvasRenderer';

export class RendererFactory {
  private lastRenderType: 'canvas' | 'docs';

  private rendererMap = new Map<string, AbstractRenderer>();

  public async getRendererInstance(storyId: string, targetDOMNode: HTMLElement) {
    const renderType = getRenderType(targetDOMNode);
    // keep only instances of the same type
    if (this.lastRenderType && this.lastRenderType !== renderType) {
      this.rendererMap.clear();
      await AbstractRenderer.resetPlatformBrowserDynamic();
    }

    if (!this.rendererMap.has(storyId)) {
      this.rendererMap.set(storyId, this.buildRenderer(storyId, renderType));
    }

    this.lastRenderType = renderType;
    return this.rendererMap.get(storyId);
  }

  private buildRenderer(storyId: string, renderType: 'canvas' | 'docs') {
    if (renderType === 'docs') {
      return new DocsRenderer(storyId);
    }
    return new CanvasRenderer(storyId);
  }
}

export const getRenderType = (targetDOMNode: HTMLElement): 'canvas' | 'docs' => {
  return targetDOMNode.id === 'root' ? 'canvas' : 'docs';
};
