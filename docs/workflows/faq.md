---
title: 'Frequently Asked Questions'
---

Here are some answers to frequently asked questions. If you have a question, you can ask it by opening an issue on the [Storybook Repository](https://github.com/storybookjs/storybook/).

### How can I opt-out of Angular Ivy?

In case you are having trouble with Angular Ivy you can deactivate it in your `main.js`:

```javascript
module.exports = {
  stories: [
    /* ... */
  ],
  addons: [
    /* ... */
  ],
  angularOptions: {
    enableIvy: false,
  },
};
```

Please report any issues related to Ivy in our [GitHub Issue Tracker](https://github.com/storybookjs/storybook/labels/app%3A%20angular) as the support for View Engine will be dropped in a future release of Angular.

### How can I run coverage tests with Create React App and leave out stories?

Create React App does not allow providing options to Jest in your `package.json`, however you can run `jest` with commandline arguments:

```sh
npm test -- --coverage --collectCoverageFrom='["src/**/*.{js,jsx}","!src/**/stories/*"]'
```

<div class="aside">
💡 <strong>Note</strong>: If you're using <a href="https://yarnpkg.com/">yarn</a> as a package manager, you'll need to adjust the command accordingly.
</div>

### I see `ReferenceError: React is not defined` when using Storybook with Next.js

Next automatically defines `React` for all of your files via a babel plugin. In Storybook, you can solve this either by:

1.  Adding `import React from 'react'` to your component files.
2.  Adding a `.babelrc` that includes [`babel-plugin-react-require`](https://www.npmjs.com/package/babel-plugin-react-require)

### How do I setup Storybook to share Webpack configuration with Next.js?

You can generally reuse webpack rules by placing them in a file that is `require()`-ed from both your `next.config.js` and your `.storybook/main.js` files. For example:

```js
module.exports = {
  webpackFinal: async (baseConfig) => {
    const nextConfig = require('/path/to/next.config.js');

    // merge whatever from nextConfig into the webpack config storybook will use
    return { ...baseConfig };
  },
};
```

### How do I setup React Fast Refresh with Storybook?

Fast refresh is an opt-in feature that can be used in Storybook React.
There are two ways that you can enable it, go ahead and pick one:

- You can set a `FAST_REFRESH` environment variable in your `.env` file:

```
FAST_REFRESH=true
```

- Or you can set the following properties in your `.storybook/main.js` files:

```js
module.exports = {
  reactOptions: {
    fastRefresh: true,
  },
};
```

<div class="aside">
💡 <strong>Note:</strong> Fast Refresh only works in development mode with React 16.10 or higher.
</div>

### Why is there no addons channel?

A common error is that an addon tries to access the "channel", but the channel is not set. It can happen in a few different cases:

1.  You're trying to access addon channel (e.g., by calling `setOptions`) in a non-browser environment like Jest. You may need to add a channel mock:

    ```js
    import { addons, mockChannel } from '@storybook/addons';

    addons.setChannel(mockChannel());
    ```

2.  In React Native, it's a special case documented in [#1192](https://github.com/storybookjs/storybook/issues/1192)

### Can I modify React component state in stories?

Not directly. If you control the component source, you can do something like this:

```js
import React, { Component } from 'react';

export default {
  title: 'MyComponent',
};

class MyComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      someVar: 'defaultValue',
      ...props.initialState,
    };
  }
  // ...
}

export const defaultView = () => <MyComponent initialState={} />;
```

### Why aren't Controls visible in the Canvas panel but visible in the Docs panel?

If you're adding Storybook's dependencies manually, make sure you include the [`@storybook/addon-controls`](https://www.npmjs.com/package/@storybook/addon-controls) dependency in your project and reference it in your `.storybook/main.js` as follows:

```js
// .storybook/main.js

module.exports = {
  addons: ['@storybook/addon-controls'],
};
```

### Why aren't the addons working in a composed Storybook?

Composition is a new feature that we released with version 6.0, and there are still some limitations to it.

For now, the addons you're using in a composed Storybook will not work.

We're working on overcoming this limitation, and soon you'll be able to use them as if you are working with a non-composed Storybook.

### Which community addons are compatible with the latest version of Storybook?

Starting with Storybook version 6.0, we've introduced some great features aimed at streamlining your development workflow.

With this, we would like to point out that if you plan on using addons created by our fantastic community, you need to consider that some of those addons might be working with an outdated version of Storybook.

We're actively working to provide a better way to address this situation, but in the meantime, we would ask for a bit of caution on your end so that you don't run into unexpected problems. Let us know by creating an issue in the [Storybook repo](https://github.com/storybookjs/storybook/issues) so that we can gather information and create a curated list with those addons to help not only you but the rest of the community.

### Is it possible to browse the documentation for past versions of Storybook?

With the release of version 6.0, we updated our documentation as well. That doesn't mean that the old documentation was removed. We kept it to help you with your Storybook migration process. Use the content from the table below in conjunction with our <a href="https://github.com/storybookjs/storybook/blob/next/MIGRATION.md">migration guide</a> .

We're only covering versions 5.3 and 5.0 as they were important milestones for Storybook. If you want to go back in time a little more, you'll have to check the specific release in the monorepo.

| Section          | Page                                       | Current Location                                                                   | Version 5.3 location                                                                                                                                                                                                                                                 | Version 5.0 location                                                                                                                                     |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Get Started      | Install                                    | [See current documentation](../get-started/install.md)                             | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/guides/quick-start-guide)                                                                                                                                     | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/guides/quick-start-guide)                         |
|                  | What's a story                             | [See current documentation](../get-started/whats-a-story.md)                       | [See versioned documentation for your framework](https://github.com/storybookjs/storybook/blob/release/5.3/docs/src/pages/guides)                                                                                                                                    | [See versioned documentation for your framework](https://github.com/storybookjs/storybook/blob/release/5.0/docs/src/pages/guides)                        |
|                  | Browse Stories                             | [See current documentation](../get-started/browse-stories.md)                      | [See versioned documentation for your framework](https://github.com/storybookjs/storybook/blob/release/5.3/docs/src/pages/guides)                                                                                                                                    | [See versioned documentation for your framework](https://github.com/storybookjs/storybook/blob/release/5.0/docs/src/pages/guides)                        |
|                  | Setup                                      | [See current documentation](../get-started/setup.md)                               | [See versioned documentation for your framework](https://github.com/storybookjs/storybook/blob/release/5.3/docs/src/pages/guides)                                                                                                                                    | [See versioned documentation for your framework](https://github.com/storybookjs/storybook/blob/release/5.0/docs/src/pages/guides)                        |
| Writing Stories  | Introduction                               | [See current documentation](../writing-stories/introduction.md)                    | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/basics/writing-stories)                                                                                                                                       | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/basics/writing-stories)                           |
|                  | Parameters                                 | [See current documentation](../writing-stories/parameters.md)                      | See versioned documentation here                                                                                                                                                                                                                                     | Non existing feature or undocumented                                                                                                                     |
|                  | Decorators                                 | [See current documentation](../writing-stories/decorators.md)                      | See versioned documentation here                                                                                                                                                                                                                                     | See versioned documentation here                                                                                                                         |
|                  | Naming components and hierarchy            | [See current documentation](../writing-stories/naming-components-and-hierarchy.md) | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/basics/writing-stories)                                                                                                                                       | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/basics/writing-stories)                           |
| Writing Docs     | DocsPage                                   | [See current documentation](../writing-docs/docs-page.md)                          | See versioned addon documentation                                                                                                                                                                                                                                    | Non existing feature or undocumented                                                                                                                     |
|                  | MDX                                        | [See current documentation](../writing-docs/mdx.md)                                | See versioned addon documentation                                                                                                                                                                                                                                    | Non existing feature or undocumented                                                                                                                     |
|                  | Doc Blocks                                 | [See current documentation](../writing-docs/doc-blocks.md)                         | [See versioned addon documentation](https://github.com/storybookjs/storybook/tree/release/5.3/addons/docs/)                                                                                                                                                          | Non existing feature or undocumented                                                                                                                     |
|                  | Preview and build docs                     | [See current documentation](../writing-docs/build-documentation.md)                | Non existing feature or undocumented                                                                                                                                                                                                                                 | Non existing feature or undocumented                                                                                                                     |
| Essential addons | Controls                                   | [See current documentation](../essentials/controls.md)                             | Controls are specific to version 6.0 see [Knobs versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/addons/knobs)                                                                                                                     | Controls are specific to version 6.0 see [Knobs versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/addons/knobs)         |
|                  | Actions                                    | [See current documentation](../essentials/actions.md)                              | [See addon versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/addons/actions)                                                                                                                                                        | [See addon versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/addons/actions)                                            |
|                  | Viewport                                   | [See current documentation](../essentials/viewport.md)                             | [See addon versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/addons/viewport)                                                                                                                                                       | [See addon versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/addons/viewport)                                           |
|                  | Backgrounds                                | [See current documentation](../essentials/backgrounds.md)                          | [See addon versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/addons/backgrounds)                                                                                                                                                    | [See addon versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/addons/backgrounds)                                        |
|                  | Toolbars and globals                       | [See current documentation](../essentials/toolbars-and-globals.md)                 | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/basics/toolbar-guide)                                                                                                                                         | Non existing feature or undocumented                                                                                                                     |
| Configure        | Overview                                   | [See current documentation](../configure/overview.md)                              | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/overview)                                                                                                                                      | [See versioned documentation](https://github.com/storybookjs/storybook/blob/release/5.0/docs/src/pages/basics/writing-stories)                           |
|                  | Integration/Webpack                        | [See current documentation](../configure/webpack.md)                               | See versioned documentation                                                                                                                                                                                                                                          | See versioned documentation                                                                                                                              |
|                  | Integration/Babel                          | [See current documentation](../configure/babel.md)                                 | See versioned documentation here and [here](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/custom-babel-config)                                                                                                             | See versioned documentation here and [here](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/custom-babel-config) |
|                  | Integration/Typescript                     | [See current documentation](../configure/typescript.md)                            | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/typescript-config)                                                                                                                             | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/typescript-config)                 |
|                  | Integration/Styling and CSS                | [See current documentation](../configure/styling-and-css.md)                       | See versioned documentation                                                                                                                                                                                                                                          | See versioned documentation                                                                                                                              |
|                  | Integration/Images and assets              | [See current documentation](../configure/images-and-assets.md)                     | See versioned documentation                                                                                                                                                                                                                                          | See versioned documentation                                                                                                                              |
|                  | Story rendering                            | [See current documentation](../configure/story-rendering.md)                       | See versioned documentation [here](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/add-custom-head-tags) and [here](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/add-custom-body) | See versioned documentation [here](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/add-custom-head-tags)         |
|                  | Story Layout                               | [See current documentation](../configure/story-layout.md)                          | Non existing feature or undocumented                                                                                                                                                                                                                                 | Non existing feature or undocumented                                                                                                                     |
|                  | User Interface/Features and behavior       | [See current documentation](../configure/features-and-behavior.md)                 | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/options-parameter)                                                                                                                             | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/options-parameter)                 |
|                  | User Interface/Theming                     | [See current documentation](../configure/theming.md)                               | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/theming)                                                                                                                                       | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/theming)                           |
|                  | User Interface/Sidebar & URLS              | [See current documentation](../configure/sidebar-and-urls.md)                      | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/options-parameter)                                                                                                                             | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/options-parameter)                 |
|                  | Environment variables                      | [See current documentation](../configure/environment-variables.md)                 | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/env-vars)                                                                                                                                      | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/env-vars)                          |
| Workflows        | Publish Storybook                          | [See current documentation](./publish-storybook.md)                                | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/basics/exporting-storybook)                                                                                                                                   | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/basics/exporting-storybook)                       |
|                  | Build pages and screens                    | [See current documentation](./build-pages-with-storybook.md)                       | Non existing feature or undocumented                                                                                                                                                                                                                                 | Non existing feature or undocumented                                                                                                                     |
|                  | Stories for multiple components            | [See current documentation](./stories-for-multiple-components.md)                  | Non existing feature or undocumented                                                                                                                                                                                                                                 | Non existing feature or undocumented                                                                                                                     |
|                  | Testing with Storybook/Unit Testing        | [See current documentation](./unit-testing.md)                                     | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/testing/react-ui-testing)                                                                                                                                     | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/testing/react-ui-testing)                         |
|                  | Testing with Storybook/Visual Testing      | [See current documentation](./visual-testing.md)                                   | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/testing/automated-visual-testing)                                                                                                                             | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/testing/automated-visual-testing)                 |
|                  | Testing with Storybook/Interaction Testing | [See current documentation](./interaction-testing.md)                              | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/testing/interaction-testing)                                                                                                                                  | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/testing/interaction-testing)                      |
|                  | Testing with Storybook/Snapshot Testing    | [See current documentation](./snapshot-testing.md)                                 | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/testing/structural-testing)                                                                                                                                   | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/testing/structural-testing)                       |
| Addons           | Introduction                               | [See current documentation](../addons/introduction.md)                             | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/addons/writing-addons)                                                                                                                                        | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/addons/writing-addons)                            |
|                  | Install addons                             | [See current documentation](../addons/install-addons.md)                           | [See versioned documentation](https://github.com/storybookjs/storybook/blob/release/5.3/docs/src/pages/addons/using-addons/)                                                                                                                                         | [See versioned documentation](https://github.com/storybookjs/storybook/blob/release/5.0/docs/src/pages/addons/using-addons/)                             |
|                  | Writing Addons                             | [See current documentation](../addons/writing-addons.md)                           | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/addons/writing-addons)                                                                                                                                        | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/addons/writing-addons)                            |
|                  | Writing Presets                            | [See current documentation](../addons/writing-presets.md)                          | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/presets/writing-presets)                                                                                                                                      | Non existing feature or undocumented                                                                                                                     |
|                  | Addons Knowledge Base                      | [See current documentation](../addons/addon-knowledge-base.md)                     | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/addons/writing-addons)                                                                                                                                        | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/addons/writing-addons)                            |
|                  | Types of addons                            | [See current documentation](../addons/addon-types.md)                              | Non existing feature or undocumented                                                                                                                                                                                                                                 | Non existing feature or undocumented                                                                                                                     |
|                  | Addons API                                 | [See current documentation](../addons/addons-api.md)                               | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/addons/api)                                                                                                                                                   | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/addons/api)                                       |
| API              | Stories/Component Story Format             | [See current documentation](../api/csf.md)                                         | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/formats/component-story-format)                                                                                                                               | Non existing feature or undocumented                                                                                                                     |
|                  | Stories/MDX syntax                         | [See current documentation](../api/mdx.md)                                         | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/formats/mdx-syntax)                                                                                                                                           | Non existing feature or undocumented                                                                                                                     |
|                  | Stories/StoriesOF format (see note below)  | [See current documentation](../../lib/core/docs/storiesOf.md)                      | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/formats/storiesof-api)                                                                                                                                        | Non existing feature or undocumented                                                                                                                     |
|                  | Frameworks                                 | [See current documentation](../api/new-frameworks.md)                              | Non existing feature or undocumented                                                                                                                                                                                                                                 | Non existing feature or undocumented                                                                                                                     |
|                  | CLI options                                | [See current documentation](../api/cli-options.md)                                 | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.3/docs/src/pages/configurations/cli-options)                                                                                                                                   | [See versioned documentation](https://github.com/storybookjs/storybook/tree/release/5.0/docs/src/pages/configurations/cli-options)                       |

<div class="aside">
With the release of version 5.3, we've updated how you can write your stories more compactly and easily. It doesn't mean that the <code>storiesOf</code> format has been removed. For the time being, we're still supporting it, and we have documentation for it. But be advised that this is bound to change in the future.
</div>

### What icons are available for my toolbar or my addon?

With the [`@storybook/components`](https://www.npmjs.com/package/@storybook/components) package, you get a set of icons that you can use to customize your UI. Use the table below as a reference while writing your addon or defining your Storybook global types.
Go through this [story](https://5a375b97f4b14f0020b0cda3-wbeulgbetj.chromatic.com/?path=/story/basics-icon--labels) to see how the icons look.

| accessibility  | accessibilityalt | add          | admin        | alert         |
| -------------- | ---------------- | ------------ | ------------ | ------------- |
| arrowdown      | arrowleft        | arrowleftalt | arrowright   | arrowrightalt |
| arrowup        | back             | basket       | batchaccept  | batchdeny     |
| beaker         | bell             | bitbucket    | book         | bookmark      |
| bookmarkhollow | bottombar        | box          | branch       | browser       |
| button         | calendar         | camera       | category     | certificate   |
| check          | chevrondown      | chromatic    | circle       | circlehollow  |
| close          | closeAlt         | cog          | collapse     | comment       |
| commit         | compass          | component    | contrast     | copy          |
| cpu            | credit           | cross        | dashboard    | database      |
| delete         | discord          | docchart     | doclist      | document      |
| download       | edit             | ellipsis     | email        | expand        |
| expandalt      | eye              | eyeclose     | facebook     | facehappy     |
| faceneutral    | facesad          | filter       | flag         | folder        |
| form           | gdrive           | github       | gitlab       | globe         |
| google         | graphbar         | graphline    | graphql      | grid          |
| grow           | heart            | hearthollow  | home         | hourglass     |
| info           | key              | lightning    | lightningoff | link          |
| listunordered  | location         | lock         | markup       | medium        |
| memory         | menu             | merge        | mirror       | mobile        |
| nut            | outbox           | outline      | paintbrush   | paperclip     |
| paragraph      | phone            | photo        | pin          | play          |
| plus           | power            | print        | proceed      | profile       |
| pullrequest    | question         | redirect     | redux        | reply         |
| repository     | requestchange    | rss          | search       | share         |
| sharealt       | shield           | sidebar      | sidebaralt   | speaker       |
| star           | starhollow       | stop         | structure    | subtract      |
| support        | switchalt        | sync         | tablet       | thumbsup      |
| time           | timer            | transfer     | trash        | twitter       |
| undo           | unfold           | unlock       | upload       | user          |
| useradd        | useralt          | users        | video        | watch         |
| wrench         | youtube          | zoom         | zoomout      | zoomreset     |

### I see a "No Preview" error with a Storybook production build

If you're using the `serve` package to verify your production build of Storybook, you'll get that error. It relates to how `serve` handles rewrites. For instance, `/iframe.html` is rewritten into `/iframe`, and you'll get that error.

We recommend that you use [http-server](https://www.npmjs.com/package/http-server) instead and use the following command to preview Storybook:

```shell
npx http-server storybook-static
```

<div class="aside">
Suppose you don't want to run the command above frequently. Add <code>http-server</code> as a development dependency and create a new script to preview your production build of Storybook.
</div>

### Can I use Storybook with Vue 3?

Yes, with the release of version 6.2, Storybook now includes support for Vue 3. See the [install page](../get-started/install.md) for instructions.

### Is snapshot testing with Storyshots supported for Vue 3?

Yes, with the release of version 6.2, the [`Storyshots addon`](https://www.npmjs.com/package/@storybook/addon-storyshots) will automatically detect Vue 3 projects.

If you run into a situation where this is not the case, you can adjust the `config` object and manually specify the framework (e.g., `vue3`).

See our documentation on how to customize the [Storyshots configuration](./snapshot-testing.md).

### Why are my MDX stories not working in IE11?

Currently there's an issue when using MDX stories with IE11. This issue does <strong>not</strong> apply to [DocsPage](../writing-docs/docs-page.md). If you're interested in helping us fix this issue, read our <a href="https://github.com/storybookjs/storybook/blob/next/CONTRIBUTING.md">Contribution guidelines</a> and submit a pull request.

### Why are my mocked GraphQL queries failing with Storybook's MSW addon?

If you're working with Vue 3, you'll need to install [`@vue/apollo-composable`](https://www.npmjs.com/package/@vue/apollo-composable). With Svelte, you'll need to install [`@rollup/plugin-replace`](https://www.npmjs.com/package/@rollup/plugin-replace) and update your `rollup.config` file to the following:

```js
// rollup.config

// Boilerplate imports

import replace from '@rollup/plugin-replace';
const production = !process.env.ROLLUP_WATCH;

// Remainder rollup.config implementation

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    // Other plugins

    // Configures the replace plugin to allow Grapqhl Queries to work properly
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
};
```

With Angular, the most common issue is the placement of the `mockServiceWorker.js` file. Use this [example](https://github.com/mswjs/examples/tree/master/examples/rest-angular/) as a point of reference.

### Can I use other GraphQL providers with Storybook's MSW addon?

Yes, check the [addon's examples](https://github.com/mswjs/msw-storybook-addon/tree/master/packages/docs/src/demos) to learn how to integrate different providers.

### Can I mock GraphQL mutations with Storybook's MSW addon?

No, currently, the MSW addon only has support for GraphQL queries. If you're interested in including this feature, open an issue in the [MSW addon repository](https://github.com/mswjs/msw-storybook-addon) and follow up with the maintainer.