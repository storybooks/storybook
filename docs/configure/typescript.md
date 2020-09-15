---
title: 'TypeScript'
---

Storybook has built-in Typescript support, so your Typescript project should work with zero configuration needed.

### Default configuration

The base Typescript configuration uses [`babel-loader`](https://webpack.js.org/loaders/babel-loader/) for Typescript transpilation, and optionally [`fork-ts-checker-webpack-plugin`](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin) for checking.

Each framework uses the base configuration unless otherwise specified:

- Angular ignores the base and uses `ts-loader` and `ngx-template-loader`.
- Vue ignores the base and uses `ts-loader` and applies it to both `.tsx` and `.vue` files.
- React adds `react-docgen-typescript-plugin` to the base.

### Main.js configuration

To make it easier to configure Typescript handling, use the `typescript` field in your [`.storybook/main.js`](./overview.md#configure-story-rendering).

The following code snippets shows the fields for you to use with TypeScript:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-add-ts-config.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

| Field                            | Framework | Description                                                                              | Type                                                                          |
| :------------------------------- | :-------- | :--------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **check**                        | All       | Optionally run fork-ts-checker-webpack-plugin                                            | boolean                                                                       |
| **checkOptions**                 | All       | Options to pass to fork-ts-checker-webpack-plugin if it's enabled                        | [See docs](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin)      |
| **reactDocgen**                  | React     | Which react docgen processor to run: `react-docgen-typescript`, `react-docgen`, `none`   | string                                                                        |
| **reactDocgenTypescriptOptions** | React     | Options to pass to react-docgen-typescript-plugin if react-docgen-typescript is enabled. | [See docs](https://github.com/hipstersmoothie/react-docgen-typescript-plugin) |

Default value is [here](https://github.com/storybookjs/storybook/blob/next/lib/core/src/server/config/defaults.js)