import { Stories2SnapsConverter } from './Stories2SnapsConverter';

const target = new Stories2SnapsConverter();

describe('getSnapshotFileName', () => {
  it('fileName is provided - snapshot is stored in __snapshots__ dir', () => {
    const context = { fileName: 'foo.js', kind: null };

    const result = target.getSnapshotFileName(context);
    const platformAgnosticResult = result.replace(/\\|\//g, '/');

    expect(platformAgnosticResult).toBe('__snapshots__/foo.storyshot');
  });

  it('fileName with multiple extensions is provided - only the last extension is replaced', () => {
    const context = { fileName: 'foo.web.stories.js', kind: null };

    const result = target.getSnapshotFileName(context);
    const platformAgnosticResult = result.replace(/\\|\//g, '/');

    expect(platformAgnosticResult).toBe('__snapshots__/foo.web.stories.storyshot');
  });

  it('fileName with dir is provided - __snapshots__ dir is created inside another dir', () => {
    const context = { fileName: 'test/foo.js', kind: null };

    const result = target.getSnapshotFileName(context);
    const platformAgnosticResult = result.replace(/\\|\//g, '/');

    expect(platformAgnosticResult).toBe('test/__snapshots__/foo.storyshot');
  });
});

describe('getPossibleStoriesFiles', () => {
  it('storyshots is provided and all the posible stories file names are returned', () => {
    const storyshots = 'test/__snapshots__/foo.web.stories.storyshot';

    const result = target.getPossibleStoriesFiles(storyshots);
    const platformAgnosticResult = result.map((path) => path.replace(/\\|\//g, '/'));

    expect(platformAgnosticResult).toEqual([
      'test/foo.web.stories.js',
      'test/foo.web.stories.jsx',
      'test/foo.web.stories.ts',
      'test/foo.web.stories.tsx',
      'test/foo.web.stories.mdx',
    ]);
  });
});
