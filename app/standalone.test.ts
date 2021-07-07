import build from '@storybook/core/standalone';

jest.mock('@storybook/core/standalone');

describe.each([
  ['angular'],
  ['ember'],
  ['html'],
  ['preact'],
  ['react'],
  ['server'],
  ['svelte'],
  ['vue'],
  ['vue3'],
  ['web-components'],
  ['stencil'],
])('%s', (app) => {
  it('should run standalone', async () => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const storybook = require(`@storybook/${app}/standalone`);

    await storybook({
      mode: 'static',
      outputDir: '',
    });

    expect(build).toHaveBeenCalled();
  });
});
