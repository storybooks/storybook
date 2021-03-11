const withTests = {
  presets: [
    [
      '@babel/preset-env',
      { shippedProposals: true, useBuiltIns: 'usage', corejs: '3', targets: { node: 'current' } },
    ],
  ],
  plugins: [
    'babel-plugin-require-context-hook',
    'babel-plugin-dynamic-import-node',
    '@babel/plugin-transform-runtime',
  ],
};

const modules = process.env.BABEL_ESM === 'true' ? false : 'auto';

module.exports = {
  ignore: [
    './lib/codemod/src/transforms/__testfixtures__',
    './lib/postinstall/src/__testfixtures__',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        useBuiltIns: 'usage',
        corejs: '3',
        targets: 'defaults',
        modules,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
    'babel-plugin-macros',
    ['@emotion', { sourceMap: true, autoLabel: 'always' }],
  ],
  env: {
    test: withTests,
  },
  overrides: [
    {
      test: './examples/vue-kitchen-sink',
      presets: ['@vue/babel-preset-jsx'],
      env: {
        test: withTests,
      },
    },
    {
      test: './lib',
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            corejs: '3',
            modules,
            targets: 'defaults',
          },
        ],
        '@babel/preset-react',
      ],
      plugins: [
        ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        'babel-plugin-macros',
        '@emotion',
        'babel-plugin-add-react-displayname',
      ],
      env: {
        test: withTests,
      },
    },
    {
      test: [
        './lib/node-logger',
        './lib/core',
        './lib/core-common',
        './lib/core-server',
        './lib/builder-webpack4',
        './lib/builder-webpack5',
        './lib/codemod',
        './addons/storyshots',
        '**/src/server/**',
        '**/src/bin/**',
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            targets: {
              node: '10',
            },
            modules,
            corejs: '3',
          },
        ],
      ],
      plugins: [
        ['@emotion', { sourceMap: true, autoLabel: 'always' }],
        'babel-plugin-macros',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-transform-shorthand-properties',
        '@babel/plugin-transform-block-scoping',
        '@babel/plugin-transform-destructuring',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-export-default-from',
      ],
      env: {
        test: withTests,
      },
    },
    {
      test: ['**/virtualModuleEntry.template.js'],
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            useBuiltIns: 'usage',
            targets: {
              node: '10',
            },
            corejs: '3',
            modules: false,
          },
        ],
      ],
    },
  ],
};
