import { Component, getPlatform } from '@angular/core';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CanvasRenderer } from './CanvasRenderer';
import { RendererFactory } from './RendererFactory';
import { DocsRenderer } from './DocsRenderer';

jest.mock('@angular/platform-browser-dynamic');

declare const document: Document;
describe('RendererFactory', () => {
  let rendererFactory: RendererFactory;
  let rootTargetDOMNode: HTMLElement;
  let rootDocstargetDOMNode: HTMLElement;

  beforeEach(async () => {
    rendererFactory = new RendererFactory();
    document.body.innerHTML =
      '<div id="root"></div><div id="root-docs"><div id="story-in-docs"></div></div>';
    rootTargetDOMNode = global.document.getElementById('root');
    rootDocstargetDOMNode = global.document.getElementById('root-docs');
    (platformBrowserDynamic as any).mockImplementation(platformBrowserDynamicTesting);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CanvasRenderer', () => {
    it('should get CanvasRenderer instance', async () => {
      const render = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
      expect(render).toBeInstanceOf(CanvasRenderer);
    });

    it('should render my-story for story template', async () => {
      const render = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
      await render.render({
        storyFnAngular: {
          template: '🦊',
          props: {},
        },
        forced: false,
        parameters: {} as any,
        targetDOMNode: rootTargetDOMNode,
      });

      expect(document.body.getElementsByTagName('my-story')[0].innerHTML).toBe('🦊');
    });

    it('should render my-story for story component', async () => {
      @Component({ selector: 'foo', template: '🦊' })
      class FooComponent {}

      const render = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
      await render.render({
        storyFnAngular: {
          props: {},
        },
        forced: false,
        parameters: {
          component: FooComponent,
        },
        targetDOMNode: rootTargetDOMNode,
      });

      expect(document.body.getElementsByTagName('my-story')[0].innerHTML).toBe('<foo>🦊</foo>');
    });

    describe('when forced=true', () => {
      beforeEach(async () => {
        // Init first render
        const render = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
        await render.render({
          storyFnAngular: {
            template: '{{ logo }}: {{ name }}',
            props: {
              logo: '🦊',
              name: 'Fox',
            },
          },
          forced: true,
          parameters: {} as any,
          targetDOMNode: rootTargetDOMNode,
        });
      });

      it('should be rendered a first time', async () => {
        expect(document.body.getElementsByTagName('my-story')[0].innerHTML).toBe('🦊: Fox');
      });

      it('should not be re-rendered when only props change', async () => {
        let countDestroy = 0;

        getPlatform().onDestroy(() => {
          countDestroy += 1;
        });
        // only props change
        const render = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
        await render.render({
          storyFnAngular: {
            props: {
              logo: '👾',
            },
          },
          forced: true,
          parameters: {} as any,
          targetDOMNode: rootTargetDOMNode,
        });
        expect(countDestroy).toEqual(0);

        expect(document.body.getElementsByTagName('my-story')[0].innerHTML).toBe('👾: Fox');
      });

      it('should be re-rendered when template change', async () => {
        const render = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
        await render.render({
          storyFnAngular: {
            template: '{{ beer }}',
            props: {
              beer: '🍺',
            },
          },
          forced: true,
          parameters: {} as any,
          targetDOMNode: rootTargetDOMNode,
        });

        expect(document.body.getElementsByTagName('my-story')[0].innerHTML).toBe('🍺');
      });

      it('should be re-rendered when moduleMetadata structure change', async () => {
        let countDestroy = 0;

        getPlatform().onDestroy(() => {
          countDestroy += 1;
        });

        // Only props change -> no full rendering
        const firstRender = await rendererFactory.getRendererInstance(
          'my-story',
          rootTargetDOMNode
        );
        await firstRender.render({
          storyFnAngular: {
            template: '{{ logo }}: {{ name }}',
            props: {
              logo: '🍺',
              name: 'Beer',
            },
          },
          forced: true,
          parameters: {} as any,
          targetDOMNode: rootTargetDOMNode,
        });
        expect(countDestroy).toEqual(0);

        // Change in the module structure -> full rendering
        const secondRender = await rendererFactory.getRendererInstance(
          'my-story',
          rootTargetDOMNode
        );
        await secondRender.render({
          storyFnAngular: {
            template: '{{ logo }}: {{ name }}',
            props: {
              logo: '🍺',
              name: 'Beer',
            },
            moduleMetadata: { providers: [{ provide: 'foo', useValue: 42 }] },
          },
          forced: true,
          parameters: {} as any,
          targetDOMNode: rootTargetDOMNode,
        });
        expect(countDestroy).toEqual(1);
      });
    });

    it('should properly destroy angular platform between each render', async () => {
      let countDestroy = 0;

      const firstRender = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
      await firstRender.render({
        storyFnAngular: {
          template: '🦊',
          props: {},
        },
        forced: false,
        parameters: {} as any,
        targetDOMNode: rootTargetDOMNode,
      });

      getPlatform().onDestroy(() => {
        countDestroy += 1;
      });

      const secondRender = await rendererFactory.getRendererInstance('my-story', rootTargetDOMNode);
      await secondRender.render({
        storyFnAngular: {
          template: '🐻',
          props: {},
        },
        forced: false,
        parameters: {} as any,
        targetDOMNode: rootTargetDOMNode,
      });

      expect(countDestroy).toEqual(1);
    });
  });

  describe('DocsRenderer', () => {
    it('should get DocsRenderer instance', async () => {
      const render = await rendererFactory.getRendererInstance(
        'my-story-in-docs',
        rootDocstargetDOMNode
      );
      expect(render).toBeInstanceOf(DocsRenderer);
    });
  });
});
