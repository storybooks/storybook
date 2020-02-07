module.exports = {
  stories: [
    // FIXME: Breaks e2e tests './intro.stories.mdx',
    '../../lib/ui/src/**/*.stories.(js|tsx|mdx)',
    '../../lib/components/src/**/*.stories.(js|tsx|mdx)',
    './stories/**/*.stories.(js|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-storysource',
    '@storybook/addon-design-assets',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-events',
    '@storybook/addon-options',
    '@storybook/addon-knobs',
    '@storybook/addon-cssresources',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-jest',
    '@storybook/addon-viewport',
    '@storybook/addon-graphql',
    '@storybook/addon-contexts',
  ],
  webpackFinal: async (config, { configType }) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules.slice(1),
        {
          test: /\.(mjs|jsx?|tsx?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: `.cache/storybook`,
                presets: [
                  [
                    '@babel/preset-env',
                    { shippedProposals: true, useBuiltIns: 'usage', corejs: 3 },
                  ],
                  '@babel/preset-typescript',
                  configType === 'PRODUCTION' && [
                    'babel-preset-minify',
                    { builtIns: false, mangle: false },
                  ],
                  '@babel/preset-react',
                  '@babel/preset-flow',
                ].filter(Boolean),
                plugins: [
                  '@babel/plugin-proposal-object-rest-spread',
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import',
                  ['babel-plugin-emotion', { sourceMap: true, autoLabel: true }],
                  'babel-plugin-macros',
                  '@babel/plugin-transform-react-constant-elements',
                  'babel-plugin-add-react-displayname',
                  [
                    'babel-plugin-react-docgen',
                    { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' },
                  ],
                ],
              },
            },
          ],
          exclude: [/node_modules/, /dist/],
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: [/node_modules/, /dist/, /\.(story|stories).(ts|tsx)$/],
          loader: require.resolve('webpack-react-docgen-typescript'),
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...(config.resolve.extensions || []), '.ts', '.tsx'],
    },
  }),
};
