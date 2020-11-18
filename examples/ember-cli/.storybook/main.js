const path = require('path');
const namedBlockPolyfill = require('ember-named-blocks-polyfill/lib/named-blocks-polyfill-plugin');

module.exports = {
  emberOptions: {
    polyfills: [namedBlockPolyfill],
  },
  stories: ['../stories/**/*.stories.[jt]s'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../')],
      enforce: 'pre',
    });
    return config;
  },
};
