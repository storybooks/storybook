import { sortEntries } from './entries';

describe('sortEntries', () => {
  it('should do nothing', () => {
    const input = ['a', 'b', 'c', 'aa', 'cc', '123', '8000'];
    const output = sortEntries(input);

    expect(output).toEqual(['a', 'b', 'c', 'aa', 'cc', '123', '8000']);
  });
  it('should move preview-type generated-config entries after all other generated entries', () => {
    const input = [
      'lib/core-client/dist/esm/common/polyfills.js',
      'lib/core-client/dist/esm/preview/globals.js',
      'examples/web-components-kitchen-sink/.storybook/storybook-init-framework-entry.js',
      'examples/web-components-kitchen-sink/.storybook/preview.js-generated-config-entry.js',
      'addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      'addons/docs/dist/frameworks/web-components/config.js-generated-other-entry.js',
      'addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      'addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
    ];
    const output = sortEntries(input);
    expect(output).toEqual([
      'lib/core-client/dist/esm/common/polyfills.js',
      'lib/core-client/dist/esm/preview/globals.js',
      'examples/web-components-kitchen-sink/.storybook/storybook-init-framework-entry.js',
      'addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      'addons/docs/dist/frameworks/web-components/config.js-generated-other-entry.js',
      'addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      'addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
      'examples/web-components-kitchen-sink/.storybook/preview.js-generated-config-entry.js',
    ]);
  });
  it('should move stories-type after all other generated entries', () => {
    const input = [
      'lib/core-client/dist/esm/common/polyfills.js',
      'lib/core-client/dist/esm/preview/globals.js',
      'examples/official-storybook/storybook-init-framework-entry.js',
      'examples/official-storybook/preview.js-generated-config-entry.js',
      'addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      'addons/docs/dist/frameworks/react/config.js-generated-other-entry.js',
      'addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      'addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/queryparams/dist/preset/addDecorator.js-generated-other-entry.js',
      'examples/official-storybook/generated-stories-entry.cjs',
    ];
    const output = sortEntries(input);
    expect(output).toEqual([
      'lib/core-client/dist/esm/common/polyfills.js',
      'lib/core-client/dist/esm/preview/globals.js',
      'examples/official-storybook/storybook-init-framework-entry.js',
      'addons/docs/dist/frameworks/common/config.js-generated-other-entry.js',
      'addons/docs/dist/frameworks/react/config.js-generated-other-entry.js',
      'addons/actions/dist/preset/addArgs.js-generated-other-entry.js',
      'addons/links/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/knobs/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/a11y/dist/preset/addDecorator.js-generated-other-entry.js',
      'addons/queryparams/dist/preset/addDecorator.js-generated-other-entry.js',
      'examples/official-storybook/preview.js-generated-config-entry.js',
      'examples/official-storybook/generated-stories-entry.cjs',
    ]);
  });
});
