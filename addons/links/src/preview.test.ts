import { addons } from '@storybook/addons';
import { SELECT_STORY } from '@storybook/core-events';
import root from '@storybook/global-root';
import { linkTo, hrefTo } from './preview';

const __STORYBOOK_STORY_STORE__ = root.__STORYBOOK_STORY_STORE__ as any;

jest.mock('@storybook/addons');
jest.mock('@storybook/global-root', () => ({
  document: global.document,
  window: global,
  __STORYBOOK_STORY_STORE__: {
    // Returns StoreSelection
    getSelection: jest.fn(() => ({
      storyId: 'kind--name',
      viewMode: 'docs',
    })),
    // Returns PublishedStoreItem from where StoryIdentifier is mocked
    fromId: jest.fn(() => ({
      id: 'kind--name',
      name: 'name',
      kind: 'kind',
    })),
  },
  __STORYBOOK_CLIENT_API__: {
    // Returns PublishedStoreItem from where StoryIdentifier is mocked
    raw: jest.fn(() => [
      {
        id: 'kind--name',
        name: 'name',
        kind: 'kind',
      },
      {
        id: 'kindname--namekind',
        name: 'namekind',
        kind: 'kindname',
      },
    ]),
  },
}));

const mockAddons = (addons as unknown) as jest.Mocked<typeof addons>;

describe('preview', () => {
  const channel = { emit: jest.fn() };
  beforeAll(() => {
    mockAddons.getChannel.mockReturnValue(channel as any);
  });
  beforeEach(channel.emit.mockReset);
  describe('linkTo()', () => {
    it('should select the kind and story provided', () => {
      const handler = linkTo('kind', 'name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should select the kind (only) provided', () => {
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation((): any => null);

      const handler = linkTo('kind');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should select the story (only) provided', () => {
      // simulate a currently selected, but not found as ID
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation((input: any) =>
        !input
          ? {
              id: 'kind--name',
              name: 'name',
              kind: 'kind',
            }
          : null
      );

      const handler = linkTo(undefined, 'kind');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should select the id provided', () => {
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation((input: any) =>
        input === 'kind--name'
          ? {
              id: 'kind--name',
              name: 'name',
              kind: 'kind',
            }
          : null
      );

      const handler = linkTo('kind--name');
      handler();

      expect(channel.emit).toHaveBeenCalledWith(SELECT_STORY, {
        kind: 'kind',
        story: 'name',
      });
    });

    it('should handle functions returning strings', () => {
      __STORYBOOK_STORY_STORE__.fromId.mockImplementation((input: any): any => null);

      const handler = linkTo(
        // @ts-expect-error
        (a, b) => a + b,
        (a, b) => b + a
      );

      handler('kind', 'name');

      expect(channel.emit.mock.calls[0]).toEqual([
        SELECT_STORY,
        {
          kind: 'kindname',
          story: 'namekind',
        },
      ]);
    });
  });

  describe('hrefTo()', () => {
    it('should return promise resolved with story href', async () => {
      const href = await hrefTo('kind', 'name');
      expect(href).toContain('?id=kind--name');
    });
  });
});
