//
import createChannel from '@storybook/channel-postmessage';
import { toId } from '@storybook/csf';
import addons, { mockChannel } from '@storybook/addons';
import Events from '@storybook/core-events';

import StoryStore, { ErrorLike } from './story_store';
import { defaultDecorateStory } from './decorators';

jest.mock('@storybook/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

let channel;
beforeEach(() => {
  channel = createChannel({ page: 'preview' });
});

// make a story and add it to the store
const addStoryToStore = (store, kind, name, storyFn, parameters = {}) =>
  store.addStory(
    {
      kind,
      name,
      storyFn,
      parameters,
      id: toId(kind, name),
    },
    {
      applyDecorators: defaultDecorateStory,
    }
  );

describe('preview.story_store', () => {
  describe('extract', () => {
    it('produces stories objects with inherited (denormalized) metadata', () => {
      const store = new StoryStore({ channel });

      store.addGlobalMetadata({ parameters: { global: 'global' }, decorators: [] });

      store.addKindMetadata('a', { parameters: { kind: 'kind' }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0, { story: 'story' });
      addStoryToStore(store, 'a', '2', () => 0);
      addStoryToStore(store, 'b', '1', () => 0);

      const extracted = store.extract();

      // We need exact key ordering, even if in theory JS doesn't guarantee it
      expect(Object.keys(extracted)).toEqual(['a--1', 'a--2', 'b--1']);

      // content of item should be correct
      expect(extracted['a--1']).toMatchObject({
        id: 'a--1',
        kind: 'a',
        name: '1',
        parameters: { global: 'global', kind: 'kind', story: 'story' },
      });
    });
  });

  describe('getDataForManager', () => {
    it('produces stories objects with normalized metadata', () => {
      const store = new StoryStore({ channel });

      store.addGlobalMetadata({ parameters: { global: 'global' }, decorators: [] });

      store.addKindMetadata('a', { parameters: { kind: 'kind' }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0, { story: 'story' });

      const { v, globalParameters, kindParameters, stories } = store.getDataForManager();

      expect(v).toBe(2);
      expect(globalParameters).toEqual({ global: 'global' });
      expect(Object.keys(kindParameters)).toEqual(['a']);
      expect(kindParameters.a).toEqual({ kind: 'kind', argTypes: {} });

      expect(Object.keys(stories)).toEqual(['a--1']);
      expect(stories['a--1']).toMatchObject({
        id: 'a--1',
        kind: 'a',
        name: '1',
        parameters: { story: 'story' },
      });
    });
  });

  describe('getRawStory', () => {
    it('produces a story with inherited decorators applied', () => {
      const store = new StoryStore({ channel });

      const globalDecorator = jest.fn().mockImplementation((s) => s());
      store.addGlobalMetadata({ parameters: {}, decorators: [globalDecorator] });

      const kindDecorator = jest.fn().mockImplementation((s) => s());
      store.addKindMetadata('a', { parameters: {}, decorators: [kindDecorator] });

      const story = jest.fn();
      addStoryToStore(store, 'a', '1', story);

      const { getDecorated } = store.getRawStory('a', '1');
      getDecorated()();

      expect(globalDecorator).toHaveBeenCalled();
      expect(kindDecorator).toHaveBeenCalled();
      expect(story).toHaveBeenCalled();
    });
  });

  describe('args', () => {
    it('is initialized to the value stored in parameters.args[name] || parameters.argType[name].defaultValue', () => {
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a', '1', () => 0, {
        argTypes: {
          arg1: { defaultValue: 'arg1' },
          arg2: { defaultValue: 2 },
          arg3: { defaultValue: { complex: { object: ['type'] } } },
          arg4: {},
          arg5: {},
        },
        args: {
          arg2: 3,
          arg4: 'foo',
          arg6: false,
        },
      });
      expect(store.getRawStory('a', '1').args).toEqual({
        arg1: 'arg1',
        arg2: 3,
        arg3: { complex: { object: ['type'] } },
        arg4: 'foo',
        arg6: false,
      });
    });

    it('updateStoryArgs changes the args of a story, per-key', () => {
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a', '1', () => 0);
      expect(store.getRawStory('a', '1').args).toEqual({});

      store.updateStoryArgs('a--1', { foo: 'bar' });
      expect(store.getRawStory('a', '1').args).toEqual({ foo: 'bar' });

      store.updateStoryArgs('a--1', { baz: 'bing' });
      expect(store.getRawStory('a', '1').args).toEqual({ foo: 'bar', baz: 'bing' });
    });

    it('is passed to the story in the context', () => {
      const storyFn = jest.fn();
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a', '1', storyFn, { passArgsFirst: false });
      store.updateStoryArgs('a--1', { foo: 'bar' });
      store.getRawStory('a', '1').storyFn();

      expect(storyFn).toHaveBeenCalledWith(
        expect.objectContaining({
          args: { foo: 'bar' },
        })
      );
    });

    it('updateStoryArgs emits STORY_ARGS_UPDATED', () => {
      const onArgsChangedChannel = jest.fn();
      const testChannel = mockChannel();
      testChannel.on(Events.STORY_ARGS_UPDATED, onArgsChangedChannel);

      const store = new StoryStore({ channel: testChannel });
      addStoryToStore(store, 'a', '1', () => 0);

      store.updateStoryArgs('a--1', { foo: 'bar' });
      expect(onArgsChangedChannel).toHaveBeenCalledWith('a--1', { foo: 'bar' });

      store.updateStoryArgs('a--1', { baz: 'bing' });
      expect(onArgsChangedChannel).toHaveBeenCalledWith('a--1', { foo: 'bar', baz: 'bing' });
    });

    it('should update if the UPDATE_STORY_ARGS event is received', () => {
      const testChannel = mockChannel();
      const store = new StoryStore({ channel: testChannel });
      addStoryToStore(store, 'a', '1', () => 0);

      testChannel.emit(Events.UPDATE_STORY_ARGS, 'a--1', { foo: 'bar' });

      expect(store.getRawStory('a', '1').args).toEqual({ foo: 'bar' });
    });

    it('passes args as the first argument to the story if `parameters.passArgsFirst` is true', () => {
      const store = new StoryStore({ channel });

      store.addKindMetadata('a', {
        parameters: {
          argTypes: {
            a: { defaultValue: 1 },
          },
        },
        decorators: [],
      });

      const storyOne = jest.fn();
      addStoryToStore(store, 'a', '1', storyOne, { passArgsFirst: false });

      store.getRawStory('a', '1').storyFn();
      expect(storyOne).toHaveBeenCalledWith(
        expect.objectContaining({
          args: { a: 1 },
          parameters: expect.objectContaining({}),
        })
      );

      const storyTwo = jest.fn();
      addStoryToStore(store, 'a', '2', storyTwo, { passArgsFirst: true });
      store.getRawStory('a', '2').storyFn();
      expect(storyTwo).toHaveBeenCalledWith(
        { a: 1 },
        expect.objectContaining({
          args: { a: 1 },
          parameters: expect.objectContaining({}),
        })
      );
    });
  });

  describe('globalArgs', () => {
    it('is initialized to the value stored in parameters.globalArgs on the first story', () => {
      const store = new StoryStore({ channel });
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          globalArgs: {
            arg1: 'arg1',
            arg2: 2,
            arg3: { complex: { object: ['type'] } },
          },
        },
      });
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();
      expect(store.getRawStory('a', '1').globalArgs).toEqual({
        arg1: 'arg1',
        arg2: 2,
        arg3: { complex: { object: ['type'] } },
      });
    });

    it('is initialized to the default values stored in parameters.globalArgsTypes on the first story', () => {
      const store = new StoryStore({ channel });
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          globalArgs: {
            arg1: 'arg1',
            arg2: 2,
          },
          globalArgTypes: {
            arg2: { defaultValue: 'arg2' },
            arg3: { defaultValue: { complex: { object: ['type'] } } },
          },
        },
      });
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();
      expect(store.getRawStory('a', '1').globalArgs).toEqual({
        arg1: 'arg1',
        arg2: 2,
        arg3: { complex: { object: ['type'] } },
      });
    });

    it('on HMR it sensibly re-initializes with memory', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          globalArgs: {
            arg1: 'arg1',
            arg2: 2,
            arg3: { complex: { object: ['type'] } },
          },
        },
      });
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      // HMR
      store.startConfiguring();
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          globalArgs: {
            arg2: 2,
            // Although we have changed the default there is no way to tell that the user didn't change
            // it themselves
            arg3: { complex: { object: ['changed'] } },
            arg4: 'new',
          },
        },
      });
      store.finishConfiguring();

      expect(store.getRawStory('a', '1').globalArgs).toEqual({
        // You cannot remove a global arg in HMR currently
        arg1: 'arg1',
        arg2: 2,
        arg3: { complex: { object: ['type'] } },
        arg4: 'new',
      });
    });

    it('updateGlobalArgs changes the global args', () => {
      const store = new StoryStore({ channel });
      addStoryToStore(store, 'a', '1', () => 0);
      expect(store.getRawStory('a', '1').globalArgs).toEqual({});

      store.updateGlobalArgs({ foo: 'bar' });
      expect(store.getRawStory('a', '1').globalArgs).toEqual({ foo: 'bar' });

      store.updateGlobalArgs({ baz: 'bing' });
      expect(store.getRawStory('a', '1').globalArgs).toEqual({ foo: 'bar', baz: 'bing' });
    });

    it('is passed to the story in the context', () => {
      const storyFn = jest.fn();
      const store = new StoryStore({ channel });

      store.updateGlobalArgs({ foo: 'bar' });
      addStoryToStore(store, 'a', '1', storyFn, { passArgsFirst: false });
      store.getRawStory('a', '1').storyFn();

      expect(storyFn).toHaveBeenCalledWith(
        expect.objectContaining({
          globalArgs: { foo: 'bar' },
        })
      );

      store.updateGlobalArgs({ baz: 'bing' });
      store.getRawStory('a', '1').storyFn();

      expect(storyFn).toHaveBeenCalledWith(
        expect.objectContaining({
          globalArgs: { foo: 'bar', baz: 'bing' },
        })
      );
    });

    it('updateGlobalArgs emits GLOBAL_ARGS_UPDATED', () => {
      const onGlobalArgsChangedChannel = jest.fn();
      const testChannel = mockChannel();
      testChannel.on(Events.GLOBAL_ARGS_UPDATED, onGlobalArgsChangedChannel);

      const store = new StoryStore({ channel: testChannel });
      addStoryToStore(store, 'a', '1', () => 0);

      store.updateGlobalArgs({ foo: 'bar' });
      expect(onGlobalArgsChangedChannel).toHaveBeenCalledWith({ foo: 'bar' });

      store.updateGlobalArgs({ baz: 'bing' });
      expect(onGlobalArgsChangedChannel).toHaveBeenCalledWith({ foo: 'bar', baz: 'bing' });
    });

    it('should update if the UPDATE_GLOBAL_ARGS event is received', () => {
      const testChannel = mockChannel();
      const store = new StoryStore({ channel: testChannel });
      addStoryToStore(store, 'a', '1', () => 0);

      testChannel.emit(Events.UPDATE_GLOBAL_ARGS, { foo: 'bar' });

      expect(store.getRawStory('a', '1').globalArgs).toEqual({ foo: 'bar' });
    });

    it('DOES NOT pass globalArgs as the first argument to the story if `parameters.passArgsFirst` is true', () => {
      const store = new StoryStore({ channel });

      const storyOne = jest.fn();
      addStoryToStore(store, 'a', '1', storyOne, { passArgsFirst: false });

      store.updateGlobalArgs({ foo: 'bar' });

      store.getRawStory('a', '1').storyFn();
      expect(storyOne).toHaveBeenCalledWith(
        expect.objectContaining({
          globalArgs: { foo: 'bar' },
        })
      );

      const storyTwo = jest.fn();
      addStoryToStore(store, 'a', '2', storyTwo, { passArgsFirst: true });
      store.getRawStory('a', '2').storyFn();
      expect(storyTwo).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          globalArgs: { foo: 'bar' },
        })
      );
    });
  });

  describe('componentArgTypesEnhancer', () => {
    it('allows you to alter argTypes when stories are added', () => {
      const store = new StoryStore({ channel });

      const enhancer = jest.fn((context) => ({ ...context.parameters.argTypes, c: 'd' }));
      store.addComponentArgTypesEnhancer(enhancer);
      store.addKindMetadata('a', { parameters: { argTypes: { a: 'b' } }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0);

      expect(enhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ a: 'b', c: 'd' });
    });

    it('only runs once per component', () => {
      const store = new StoryStore({ channel });

      const enhancer = jest.fn((context) => ({}));
      store.addComponentArgTypesEnhancer(enhancer);

      addStoryToStore(store, 'a', '1', () => 0);
      addStoryToStore(store, 'a', '2', () => 0);
      addStoryToStore(store, 'b', '1', () => 0);

      expect(enhancer).toHaveBeenCalledTimes(2);
    });

    it('recursively passes argTypes to successive enhancers', () => {
      const store = new StoryStore({ channel });

      const firstEnhancer = jest.fn((context) => ({ ...context.parameters.argTypes, c: 'd' }));
      store.addComponentArgTypesEnhancer(firstEnhancer);
      const secondEnhancer = jest.fn((context) => ({ ...context.parameters.argTypes, e: 'f' }));
      store.addComponentArgTypesEnhancer(secondEnhancer);
      store.addKindMetadata('a', { parameters: { argTypes: { a: 'b' } }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0);

      expect(firstEnhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b' } } })
      );
      expect(secondEnhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b', c: 'd' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ a: 'b', c: 'd', e: 'f' });
    });

    it('does not merge argType enhancer results', () => {
      const store = new StoryStore({ channel });

      const enhancer = jest.fn().mockReturnValue({ c: 'd' });
      store.addComponentArgTypesEnhancer(enhancer);
      store.addKindMetadata('a', { parameters: { argTypes: { a: 'b' } }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0);

      expect(enhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ c: 'd' });
    });

    it('allows you to alter argTypes when stories are re-added', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);

      const enhancer = jest.fn((context) => ({ ...context.parameters.argTypes, c: 'd' }));
      store.addComponentArgTypesEnhancer(enhancer);
      store.addKindMetadata('a', { parameters: { argTypes: { a: 'b' } }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0);

      enhancer.mockClear();
      store.removeStoryKind('a');
      store.addKindMetadata('a', { parameters: { argTypes: { e: 'f' } }, decorators: [] });

      addStoryToStore(store, 'a', '1', () => 0);
      expect(enhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { e: 'f' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ e: 'f', c: 'd' });
    });
  });

  describe('storyArgTypesEnhancer', () => {
    it('allows you to alter argTypes when stories are added', () => {
      const store = new StoryStore({ channel });

      const enhancer = jest.fn((context) => ({ ...context.parameters.argTypes, c: 'd' }));
      store.addStoryArgTypesEnhancer(enhancer);

      addStoryToStore(store, 'a', '1', () => 0, { argTypes: { a: 'b' } });

      expect(enhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ a: 'b', c: 'd' });
    });

    it('runs once per story', () => {
      const store = new StoryStore({ channel });

      const enhancer = jest.fn((context) => ({}));
      store.addStoryArgTypesEnhancer(enhancer);

      addStoryToStore(store, 'a', '1', () => 0);
      addStoryToStore(store, 'a', '2', () => 0);
      addStoryToStore(store, 'b', '1', () => 0);

      expect(enhancer).toHaveBeenCalledTimes(3);
    });

    it('recursively passes argTypes to successive enhancers', () => {
      const store = new StoryStore({ channel });

      const firstEnhancer = jest.fn((context) => ({ ...context.parameters.argTypes, c: 'd' }));
      store.addStoryArgTypesEnhancer(firstEnhancer);
      const secondEnhancer = jest.fn((context) => ({ ...context.parameters.argTypes, e: 'f' }));
      store.addStoryArgTypesEnhancer(secondEnhancer);

      addStoryToStore(store, 'a', '1', () => 0, { argTypes: { a: 'b' } });

      expect(firstEnhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b' } } })
      );
      expect(secondEnhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b', c: 'd' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ a: 'b', c: 'd', e: 'f' });
    });

    it('does not merge argType enhancer results', () => {
      const store = new StoryStore({ channel });

      const enhancer = jest.fn().mockReturnValue({ c: 'd' });
      store.addStoryArgTypesEnhancer(enhancer);

      addStoryToStore(store, 'a', '1', () => 0, { argTypes: { a: 'b' } });

      expect(enhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { a: 'b' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ c: 'd' });
    });

    it('allows you to alter argTypes when stories are re-added', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);

      const enhancer = jest.fn((context) => ({ ...context.parameters.argTypes, c: 'd' }));
      store.addStoryArgTypesEnhancer(enhancer);

      addStoryToStore(store, 'a', '1', () => 0, { argTypes: { a: 'b' } });

      enhancer.mockClear();
      store.removeStoryKind('a');

      addStoryToStore(store, 'a', '1', () => 0, { argTypes: { e: 'f' } });
      expect(enhancer).toHaveBeenCalledWith(
        expect.objectContaining({ parameters: { argTypes: { e: 'f' } } })
      );
      expect(store.getRawStory('a', '1').parameters.argTypes).toEqual({ e: 'f', c: 'd' });
    });
  });

  describe('storySort', () => {
    it('sorts stories using given function', () => {
      const store = new StoryStore({ channel });
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          options: {
            // Test function does reverse alphabetical ordering.
            storySort: (a: any, b: any): number =>
              a[1].kind === b[1].kind
                ? 0
                : -1 * a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
          },
        },
      });
      addStoryToStore(store, 'a/a', '1', () => 0);
      addStoryToStore(store, 'a/a', '2', () => 0);
      addStoryToStore(store, 'a/b', '1', () => 0);
      addStoryToStore(store, 'b/b1', '1', () => 0);
      addStoryToStore(store, 'b/b10', '1', () => 0);
      addStoryToStore(store, 'b/b9', '1', () => 0);
      addStoryToStore(store, 'c', '1', () => 0);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'c--1',
        'b-b10--1',
        'b-b9--1',
        'b-b1--1',
        'a-b--1',
        'a-a--1',
        'a-a--2',
      ]);
    });

    it('sorts stories alphabetically', () => {
      const store = new StoryStore({ channel });
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          options: {
            storySort: {
              method: 'alphabetical',
            },
          },
        },
      });
      addStoryToStore(store, 'a/b', '1', () => 0);
      addStoryToStore(store, 'a/a', '2', () => 0);
      addStoryToStore(store, 'a/a', '1', () => 0);
      addStoryToStore(store, 'c', '1', () => 0);
      addStoryToStore(store, 'b/b10', '1', () => 0);
      addStoryToStore(store, 'b/b9', '1', () => 0);
      addStoryToStore(store, 'b/b1', '1', () => 0);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'a-a--2',
        'a-a--1',
        'a-b--1',
        'b-b1--1',
        'b-b9--1',
        'b-b10--1',
        'c--1',
      ]);
    });

    it('sorts stories in specified order or alphabetically', () => {
      const store = new StoryStore({ channel });
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          options: {
            storySort: {
              method: 'alphabetical',
              order: ['b', ['bc', 'ba', 'bb'], 'a', 'c'],
            },
          },
        },
      });
      addStoryToStore(store, 'a/b', '1', () => 0);
      addStoryToStore(store, 'a', '1', () => 0);
      addStoryToStore(store, 'c', '1', () => 0);
      addStoryToStore(store, 'b/bd', '1', () => 0);
      addStoryToStore(store, 'b/bb', '1', () => 0);
      addStoryToStore(store, 'b/ba', '1', () => 0);
      addStoryToStore(store, 'b/bc', '1', () => 0);
      addStoryToStore(store, 'b', '1', () => 0);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'b--1',
        'b-bc--1',
        'b-ba--1',
        'b-bb--1',
        'b-bd--1',
        'a--1',
        'a-b--1',
        'c--1',
      ]);
    });

    it('sorts stories in specified order or by configure order', () => {
      const store = new StoryStore({ channel });
      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          options: {
            storySort: {
              method: 'configure',
              order: ['b', 'a', 'c'],
            },
          },
        },
      });
      addStoryToStore(store, 'a/b', '1', () => 0);
      addStoryToStore(store, 'a', '1', () => 0);
      addStoryToStore(store, 'c', '1', () => 0);
      addStoryToStore(store, 'b/bd', '1', () => 0);
      addStoryToStore(store, 'b/bb', '1', () => 0);
      addStoryToStore(store, 'b/ba', '1', () => 0);
      addStoryToStore(store, 'b/bc', '1', () => 0);
      addStoryToStore(store, 'b', '1', () => 0);

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'b--1',
        'b-bd--1',
        'b-bb--1',
        'b-ba--1',
        'b-bc--1',
        'a--1',
        'a-b--1',
        'c--1',
      ]);
    });
  });

  describe('configuration', () => {
    it('does not allow addStory if not configuring, unless allowUsafe=true', () => {
      const store = new StoryStore({ channel });
      store.finishConfiguring();

      expect(() => addStoryToStore(store, 'a', '1', () => 0)).toThrow(
        'Cannot add a story when not configuring'
      );

      expect(() =>
        store.addStory(
          {
            kind: 'a',
            name: '1',
            storyFn: () => 0,
            parameters: {},
            id: 'a--1',
          },
          {
            applyDecorators: defaultDecorateStory,
            allowUnsafe: true,
          }
        )
      ).not.toThrow();
    });

    it('does not allow remove if not configuring, unless allowUsafe=true', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      expect(() => store.remove('a--1')).toThrow('Cannot remove a story when not configuring');
      expect(() => store.remove('a--1', { allowUnsafe: true })).not.toThrow();
    });

    it('does not allow removeStoryKind if not configuring, unless allowUsafe=true', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      expect(() => store.removeStoryKind('a')).toThrow('Cannot remove a kind when not configuring');
      expect(() => store.removeStoryKind('a', { allowUnsafe: true })).not.toThrow();
    });

    it('waits for configuration to be over before emitting SET_STORIES', () => {
      const onSetStories = jest.fn();
      channel.on(Events.SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      addStoryToStore(store, 'a', '1', () => 0);
      expect(onSetStories).not.toHaveBeenCalled();

      store.finishConfiguring();
      expect(onSetStories).toHaveBeenCalledWith({
        v: 2,
        globalArgs: {},
        globalParameters: {},
        kindParameters: { a: { argTypes: {} } },
        stories: {
          'a--1': expect.objectContaining({
            id: 'a--1',
          }),
        },
      });
    });

    it('correctly emits globalArgs with SET_STORIES', () => {
      const onSetStories = jest.fn();
      channel.on(Events.SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      store.addGlobalMetadata({
        decorators: [],
        parameters: {
          globalArgTypes: {
            arg1: { defaultValue: 'arg1' },
          },
        },
      });

      addStoryToStore(store, 'a', '1', () => 0);
      expect(onSetStories).not.toHaveBeenCalled();

      store.finishConfiguring();
      expect(onSetStories).toHaveBeenCalledWith({
        v: 2,
        globalArgs: { arg1: 'arg1' },
        globalParameters: {
          // NOTE: Currently globalArg[Types] are emitted as parameters but this may not remain
          globalArgTypes: {
            arg1: { defaultValue: 'arg1' },
          },
        },
        kindParameters: { a: { argTypes: {} } },
        stories: {
          'a--1': expect.objectContaining({
            id: 'a--1',
          }),
        },
      });
    });

    it('emits an empty SET_STORIES if no stories were added during configuration', () => {
      const onSetStories = jest.fn();
      channel.on(Events.SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      store.finishConfiguring();
      expect(onSetStories).toHaveBeenCalledWith({
        v: 2,
        globalArgs: {},
        globalParameters: {},
        kindParameters: {},
        stories: {},
      });
    });

    it('allows configuration as second time (HMR)', () => {
      const onSetStories = jest.fn();
      channel.on(Events.SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });
      store.finishConfiguring();

      onSetStories.mockClear();
      store.startConfiguring();
      addStoryToStore(store, 'a', '1', () => 0);
      store.finishConfiguring();

      expect(onSetStories).toHaveBeenCalledWith({
        v: 2,
        globalArgs: {},
        globalParameters: {},
        kindParameters: { a: { argTypes: {} } },
        stories: {
          'a--1': expect.objectContaining({
            id: 'a--1',
          }),
        },
      });
    });
  });

  describe('HMR behaviour', () => {
    it('emits the right things after removing a story', () => {
      const onSetStories = jest.fn();
      channel.on(Events.SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      // For hooks
      addons.setChannel(channel);

      store.startConfiguring();
      addStoryToStore(store, 'kind-1', 'story-1.1', () => 0);
      addStoryToStore(store, 'kind-1', 'story-1.2', () => 0);
      store.finishConfiguring();

      onSetStories.mockClear();
      store.startConfiguring();
      store.remove(toId('kind-1', 'story-1.1'));
      store.finishConfiguring();

      expect(onSetStories).toHaveBeenCalledWith({
        v: 2,
        globalArgs: {},
        globalParameters: {},
        kindParameters: { 'kind-1': { argTypes: {} } },
        stories: {
          'kind-1--story-1-2': expect.objectContaining({
            id: 'kind-1--story-1-2',
          }),
        },
      });

      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-1', 'story-1.2'))).toBeTruthy();
    });

    it('emits the right things after removing a kind', () => {
      const onSetStories = jest.fn();
      channel.on(Events.SET_STORIES, onSetStories);
      const store = new StoryStore({ channel });

      // For hooks
      addons.setChannel(channel);

      store.startConfiguring();
      addStoryToStore(store, 'kind-1', 'story-1.1', () => 0);
      addStoryToStore(store, 'kind-1', 'story-1.2', () => 0);
      addStoryToStore(store, 'kind-2', 'story-2.1', () => 0);
      addStoryToStore(store, 'kind-2', 'story-2.2', () => 0);
      store.finishConfiguring();

      onSetStories.mockClear();
      store.startConfiguring();
      store.removeStoryKind('kind-1');
      store.finishConfiguring();

      expect(onSetStories).toHaveBeenCalledWith({
        v: 2,
        globalArgs: {},
        globalParameters: {},
        kindParameters: { 'kind-1': {}, 'kind-2': { argTypes: {} } },
        stories: {
          'kind-2--story-2-1': expect.objectContaining({
            id: 'kind-2--story-2-1',
          }),
          'kind-2--story-2-2': expect.objectContaining({
            id: 'kind-2--story-2-2',
          }),
        },
      });

      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-2', 'story-2.1'))).toBeTruthy();
    });

    // eslint-disable-next-line jest/expect-expect
    it('should not error even if you remove a kind that does not exist', () => {
      const store = new StoryStore({ channel });
      store.removeStoryKind('kind');
    });
  });

  describe('RENDER_CURRENT_STORY', () => {
    it('is NOT emitted when setError is called during configuration', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(Events.RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });

      store.setError(new Error('Something is bad!') as ErrorLike);
      expect(onRenderCurrentStory).not.toHaveBeenCalled();
    });

    it('is NOT emitted when setSelection is called during configuration', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(Events.RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });

      store.setSelection({ storyId: 'a--1', viewMode: 'story' });
      expect(onRenderCurrentStory).not.toHaveBeenCalled();
    });

    it('is emitted when configuration ends', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(Events.RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });

      store.finishConfiguring();
      expect(onRenderCurrentStory).toHaveBeenCalled();
    });

    it('is emitted when setSelection is called outside of configuration', () => {
      const onRenderCurrentStory = jest.fn();
      channel.on(Events.RENDER_CURRENT_STORY, onRenderCurrentStory);
      const store = new StoryStore({ channel });
      store.finishConfiguring();

      onRenderCurrentStory.mockClear();
      store.setSelection({ storyId: 'a--1', viewMode: 'story' });
      expect(onRenderCurrentStory).toHaveBeenCalled();
    });
  });
});
