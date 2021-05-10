import { Parameters } from './run-e2e';

const fromDeps = (...args: string[]): string =>
  [
    'cd {{name}}-{{version}}',
    // Create `yarn.lock` to force Yarn to consider adding deps in this directory
    // and not look for a yarn workspace in parent directory
    'touch yarn.lock',
    'yarn init --yes',
    args.length && `yarn add ${args.join(' ')}`,
  ]
    .filter(Boolean)
    .join(' && ');

const baseAngular: Parameters = {
  name: 'angular',
  version: 'latest',
  generator: [
    `yarn dlx --package @angular/cli@{{version}} ng new {{name}}-{{version}} --routing=true --minimal=true --style=scss --skipInstall=true --strict`,
    `cd {{name}}-{{version}}`,
  ].join(' && '),
};

export const angularv10: Parameters = {
  ...baseAngular,
  // There is no `v10-lts` tag for now, to update as soon as one is published
  version: 'v10',
};

export const angular: Parameters = baseAngular;

export const aurelia: Parameters = {
  name: 'aurelia',
  version: 'latest',
  generator: 'npx aurelia-cli@{{version}} new {{name}}-{{version}} --unattended',
  ensureDir: false,
  additionalDeps: ['@aurelia/webpack-loader'],
};

// TODO: not working yet, help needed
// export const ember: Parameters = {
//   name: 'ember',
//   version: 'latest',
//   generator:
//     'npx ember-cli@{{version}} new {{name}}-{{version}} --skip-git --skip-npm --yarn --skip-bower',
//   preBuildCommand: 'ember build',
// };

export const html: Parameters = {
  name: 'html',
  version: 'latest',
  generator: fromDeps(),
  autoDetect: false,
};

// TODO: need to install meteor first
// export const meteor: Parameters = {
//   name: 'meteor',
//   version: 'latest',
//   generator: 'meteor create {{name}}-{{version}} --minimal --react',
// };

export const preact: Parameters = {
  name: 'preact',
  version: 'latest',
  generator:
    'npx preact-cli@{{version}} create preactjs-templates/default {{name}}-{{version}} --yarn --install=false --git=false',
  ensureDir: false,
};

export const react: Parameters = {
  name: 'react',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
};

export const react_typescript: Parameters = {
  name: 'react_typescript',
  version: 'latest',
  generator: fromDeps('react', 'react-dom'),
  typescript: true,
};

// export const reactNative: Parameters = {
//   name: 'reactNative',
//   version: 'latest',
//   generator: 'npx expo-cli init {{name}}-{{version}} --template=bare-minimum --yarn',
// };

// TODO: issue in @storybook/cli init
export const cra: Parameters = {
  name: 'cra',
  version: 'latest',
  generator: [
    'yarn dlx create-react-app@{{version}} {{name}}-{{version}}',
    'cd {{name}}-{{version}}',
    'echo "FAST_REFRESH=true" > .env',
  ].join(' && '),
};

export const cra_typescript: Parameters = {
  name: 'cra_typescript',
  version: 'latest',
  generator: 'yarn dlx create-react-app@{{version}} {{name}}-{{version}} --template typescript',
};

export const sfcVue: Parameters = {
  name: 'sfcVue',
  version: 'latest',
  generator: fromDeps('vue', 'vue-loader', 'vue-template-compiler', 'webpack@webpack-4'),
};

export const svelte: Parameters = {
  name: 'svelte',
  version: 'latest',
  generator: 'yarn dlx degit sveltejs/template {{name}}-{{version}}',
};

export const vue: Parameters = {
  name: 'vue',
  version: 'latest',
  generator: [
    `echo '{"useTaobaoRegistry": false}' > ~/.vuerc`,
    // Need to remove this file otherwise there is an issue when vue-cli is trying to install the dependency in the bootstrapped folder
    `rm package.json`,
    `yarn dlx -p @vue/cli@{{version}} vue create {{name}}-{{version}} --default --packageManager=yarn --no-git --force`,
  ].join(' && '),
};

export const vue3: Parameters = {
  name: 'vue3',
  version: 'next',
  // Vue CLI v4 utilizes webpack 4, and the 5-alpha uses webpack 5 so we force ^4 here
  generator: [
    `echo '{"useTaobaoRegistry": false}' > ~/.vuerc`,
    // Need to remove this file otherwise there is an issue when vue-cli is trying to install the dependency in the bootstrapped folder
    `rm package.json`,
    `yarn dlx -p @vue/cli@^4 vue create {{name}}-{{version}} --preset=__default_vue_3__ --packageManager=yarn --no-git --force`,
  ].join(' && '),
};

export const web_components: Parameters = {
  name: 'web_components',
  version: 'latest',
  generator: fromDeps('lit-element'),
};

export const web_components_typescript: Parameters = {
  ...web_components,
  name: 'web_components_typescript',
  typescript: true,
};

export const webpack_react: Parameters = {
  name: 'webpack_react',
  version: 'latest',
  generator: fromDeps('react', 'react-dom', 'webpack@webpack-4'),
};

export const react_in_yarn_workspace: Parameters = {
  name: 'react_in_yarn_workspace',
  version: 'latest',
  generator: [
    'cd {{name}}-{{version}}',
    'echo "{ \\"name\\": \\"workspace-root\\", \\"private\\": true, \\"workspaces\\": [] }" > package.json',
    'touch yarn.lock',
    `yarn add react react-dom`,
  ].join(' && '),
};

// View results at: https://datastudio.google.com/reporting/c34f64ee-400f-4d06-ad4f-5c2133e226da
export const cra_bench: Parameters = {
  name: 'cra_bench',
  version: 'latest',
  generator: [
    'yarn dlx create-react-app@{{version}} {{name}}-{{version}}',
    'cd {{name}}-{{version}}',
    // TODO: Move from `npx` to `yarn dlx`, it is not working out of the box
    // because of the fancy things done in `@storybook/bench` to investigate 🔎
    "npx @storybook/bench 'npx sb init' --label cra",
  ].join(' && '),
};
