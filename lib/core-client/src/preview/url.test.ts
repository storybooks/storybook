import root from '@storybook/global-root';
import { pathToId, setPath, parseQueryParameters, getSelectionSpecifierFromPath } from './url';

const { history, document } = root;

jest.mock('@storybook/global-root', () => ({
  history: { replaceState: jest.fn() },
  document: {
    location: {
      pathname: 'pathname',
      search: '',
    },
  },
}));

describe('url', () => {
  describe('pathToId', () => {
    it('should parse valid ids', () => {
      expect(pathToId('/story/story--id')).toEqual('story--id');
    });
    it('should error on invalid ids', () => {
      [null, '', '/whatever/story/story--id'].forEach((path) => {
        expect(() => pathToId(path)).toThrow(/Invalid/);
      });
    });
  });

  describe('setPath', () => {
    it('should navigate to storyId', () => {
      setPath({ storyId: 'story--id', viewMode: 'story' });
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        'pathname?id=story--id&viewMode=story'
      );
    });
    it('should replace legacy parameters but preserve others', () => {
      document.location.search = 'foo=bar&selectedStory=selStory&selectedKind=selKind';
      setPath({ storyId: 'story--id', viewMode: 'story' });
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        'pathname?foo=bar&id=story--id&viewMode=story'
      );
    });
    it('should ignore + keep hashes', () => {
      document.location.search = 'foo=bar&selectedStory=selStory&selectedKind=selKind';
      document.location.hash = '#foobar';
      setPath({ storyId: 'story--id', viewMode: 'story' });
      expect(history.replaceState).toHaveBeenCalledWith(
        {},
        '',
        'pathname?foo=bar&id=story--id&viewMode=story#foobar'
      );
    });
  });

  describe('parseQueryParameters', () => {
    it('should parse id', () => {
      expect(parseQueryParameters('?foo=bar&id=story--id')).toBe('story--id');
    });
    it('should not parse non-ids', () => {
      expect(parseQueryParameters('')).toBeUndefined();
    });
  });

  describe('getSelectionSpecifierFromPath', () => {
    it('should handle no search', () => {
      document.location.search = '';
      expect(getSelectionSpecifierFromPath()).toEqual(null);
    });
    it('should handle id queries', () => {
      document.location.search = '?id=story--id';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: 'story--id',
        viewMode: 'story',
        singleStory: false,
      });
    });
    it('should handle id queries with *', () => {
      document.location.search = '?id=*';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: '*',
        viewMode: 'story',
        singleStory: false,
      });
    });
    it('should redirect legacy queries', () => {
      document.location.search = '?selectedKind=kind&selectedStory=story';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: { kind: 'kind', name: 'story' },
        viewMode: 'story',
        singleStory: false,
      });
    });
    it('should parse args', () => {
      document.location.search = '?id=story--id&args=obj.key:val';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: 'story--id',
        viewMode: 'story',
        singleStory: false,
        args: { obj: { key: 'val' } },
      });
    });
    it('should handle singleStory param', () => {
      document.location.search = '?id=abc&singleStory=true';
      expect(getSelectionSpecifierFromPath()).toEqual({
        storySpecifier: 'abc',
        viewMode: 'story',
        singleStory: true,
      });
    });
  });
});
