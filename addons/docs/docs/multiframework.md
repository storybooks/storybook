<h1>Storybook Docs framework dev guide</h1>

Storybook Docs [provides basic support for all non-RN Storybook view layers](../README.md#framework-support) out of the box. However, some frameworks have been docs-optimized, adding features like automatic props table generation and inline story rendering. This document is a dev guide for how to optimize a new framework in docs.

- [Framework-specific configuration](#framework-specific-configuration)
- [Props tables](#props-tables)
- [Component descriptions](#component-descriptions)
- [Inline story rendering](#inline-story-rendering)
- [More resources](#more-resources)

## Framework-specific configuration

Your framework might need framework-specific configuration. This could include adding extra webpack loaders or global decorators/story parameters.

Addon-docs handles this kind of customization by file naming convention. Its [common preset](https://github.com/storybookjs/storybook/blob/next/addons/docs/src/frameworks/common/preset.ts) does this by looking for files `../<framework>/{preset,config}.[tj]sx?`, where `<framework>` is the framework identifier, e.g. `vue`, `angular`, `react`, etc.

For example, consider Storybook Docs for Vue, which needs `vue-docgen-loader` in its webpack config, and also has custom extraction functions for [props tables](#props-tables) and [component descriptions](#component-descriptions).

For webpack configuration, Docs for Vue defines [preset.ts](https://github.com/storybookjs/storybook/blob/next/addons/docs/src/frameworks/vue/preset.ts), which follows the [preset](https://storybook.js.org/docs/presets/introduction) file structure:

```
export function webpack(webpackConfig: any = {}, options: any = {}) {
  webpackConfig.module.rules.push({
    test: /\.vue$/,
    loader: 'vue-docgen-loader',
    enforce: 'post',
  });
  return webpackConfig;
}
```

This appends `vue-docgen-loader` to the existing configuration, which at this point will also include modifications made by the common preset.

For props tables and descriptions, both of which are described in more detail below, it defines a file [config.tsx](https://github.com/storybookjs/storybook/blob/next/addons/docs/src/frameworks/vue/config.tsx).

## Props tables

Props tables are enabled by the framework-specific `docs.extractProps` parameter, which extracts a component's props into a common data structure.

Here's how it's done in Vue's framework-specific `preview.js`:

```js
import { extractProps } from './extractProps';

addParameters({
  docs: {
    // `container`, `page`, etc. here
    extractProps,
  },
});
```

The `extractProps` function receives a component as an argument, and returns an object of type [`PropsTableProps`](https://github.com/storybookjs/storybook/blob/next/lib/components/src/blocks/PropsTable/PropsTable.tsx#L148), which can either be an array of `PropDef` rows (React), or a mapping of section name to an array of `PropDef` rows (e.g. `Props`/`Events`/`Slots` in Vue).

```ts
export interface PropDef {
  name: string;
  type: any;
  required: boolean;
  description?: string;
  defaultValue?: any;
}
```

So far, in React and Vue, the implementation of this extraction is as follows:

- A webpack loader is added to the user's config via the preset
- The loader annotates the component with a field, `__docgenInfo`, which contains some metadata
- The view-layer specific `extractProps` function translates that metadata into `PropsTableProps`

However, for your framework you may want to implement this in some other way. There is also an effort to load data from static JSON files for performance [#7942](https://github.com/storybookjs/storybook/issues/7942).

## Component descriptions

Component descriptions are enabled by the `docs.extractComponentDescription` parameter, which extract's a component description (usually from source code comments) into a markdown string.

It follows the pattern of [Props tables](#props-tables) above, only it's even simpler because the function output is simply a string (or null if there no description).

## Inline story rendering

Inline story rendering is another framework specific optimization, made possible by the `docs.prepareForInline` parameter.

Again let's look at Vue's framework-specific `preview.js`:

```js
import toReact from '@egoist/vue-to-react';

addParameters({
  docs: {
    // `container`, `page`, etc. here
    prepareForInline: (storyFn, { args }) => {
      const Story = toReact(storyFn());
      return <Story {...args} />;
    },
  },
});
```

The input is the story function and the story context (id, parameters, args, etc.), and the output is a React element, because we render docs pages in react. In the case of Vue, all of the work is done by the `@egoist/vue-to-react` library. If there's no analogous library for your framework, you may need to figure it out yourself!

## More resources

- References: [README](../README.md) / [DocsPage](docspage.md) / [MDX](mdx.md) / [FAQ](faq.md) / [Recipes](recipes.md) / [Theming](theming.md) / [Props](props-tables.md)
- Framework-specific docs: [React](../react/README.md) / [Vue](../vue/README.md) / [Angular](../angular/README.md) / [Web components](../web-components/README.md) / [Ember](../ember/README.md)
- Announcements: [Vision](https://medium.com/storybookjs/storybook-docs-sneak-peak-5be78445094a) / [DocsPage](https://medium.com/storybookjs/storybook-docspage-e185bc3622bf) / [MDX](https://medium.com/storybookjs/rich-docs-with-storybook-mdx-61bc145ae7bc) / [Framework support](https://medium.com/storybookjs/storybook-docs-for-new-frameworks-b1f6090ee0ea)
- Example: [Storybook Design System](https://github.com/storybookjs/design-system)
