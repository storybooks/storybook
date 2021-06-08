---
title: 'Toolbars & globals'
---

Storybook ships with toolbar items to control the [viewport](./viewport.md) and [background](./backgrounds.md) the story renders in. You can also create your own toolbar items which control special “globals” which you can then read to create [decorators](../writing-stories/decorators.md) to control story rendering.

## Globals

Globals in Storybook represent “global” (as in not story-specific) inputs to the rendering of the story. As they aren’t specific to the story, they aren’t passed in the `args` argument to the story function (although they are accessible as `context.globals`), but typically you use them in decorators which apply to all stories.

When the globals change, the story re-renders and the decorators rerun with the new values. The easiest way to change globals is to create a toolbar item for them.

## Global types and the toolbar annotation

Storybook has a simple, declarative syntax for configuring toolbar menus. In your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering), you can add your own toolbars by creating `globalTypes` with a `toolbar` annotation:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-configure-globaltypes.js.mdx',
    'common/storybook-preview-configure-globaltypes.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

As globals are _global_ you can _only_ set `globalTypes` in [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering).

</div>

When you start your Storybook, you should see a new dropdown in your toolbar with options `light` and `dark`.

## Create a decorator

We have a `global` defined, let's wire it up! We can consume our new `theme` global in a decorator using the `context.globals.theme` value.

For example, suppose you are using `styled-components`. You can add a theme provider decorator to your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering) config:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-use-global-type.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Advanced usage

So far we've managed to create and consume a global inside Storybook.

Now let's take a look at a more complex example. Let's suppose we wanted to implement a new global called **locale** for internationalization, which shows a flag on the right side of the toolbar.

In your [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering), add the following:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-locales-globaltype.js.mdx',
    'common/storybook-preview-locales-globaltype.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

The <code>icon</code> element used in the examples loads the icons from the <code>@storybook/components</code> package. See [here](../workflows/faq.md#what-icons-are-available-for-my-toolbar-or-my-addon) the list of available icons that you can use.

</div>

<div class="aside">
  The <code>@storybook/addon-toolbars</code> addon is required to use toolbars. The toolbars addon is included by default in <code>@storybook/addon-essentials</code>.
</div>

By adding the configuration element `right`, the text will be displayed on the right side in the toolbar menu, once you connect it to a decorator.

Here's a list of the configuration options available.

| MenuItem  |  Type  |                           Description                           | Required |
| --------- | :----: | :-------------------------------------------------------------: | :------: |
| **value** | String |    The string value of the menu that gets set in the globals    |   Yes    |
| **title** | String |                   The main text of the title                    |   Yes    |
| **left**  | String |        A string that gets shown in left side of the menu        |    No    |
| **right** | String |       A string that gets shown in right side of the menu        |    No    |
| **icon**  | String | An icon that gets shown in the toolbar if this item is selected |    No    |

## Consuming globals from within a story

We recommend consuming globals from within a decorator and define a global setting for all stories.

But we're aware that sometimes it's more useful to use toolbar options in a per-story basis.

Using the example above, you can modify any story to retrieve the **Locale** `global` from the story context:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-story-use-globaltype.js.mdx',
    'common/my-component-story-use-globaltype.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

In Storybook 6.0, if you set the global option `passArgsFirst: false` for backwards compatibility, the story context is passed as the first argument:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/my-component-story-use-globaltype-backwards-compat.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

</div>

## Consuming globals from within an addon

If you're working on a Storybook addon and you need to retrieve globals. You can do so, the `@storybook/api` package provides a hook for this scenario, you can use the [`useGlobals()`](../addons/addons-api.md#useglobals) hook to retrieve any globals you want.

Using the ThemeProvider example above, you could expand it to display which current theme is being shown inside a panel like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/addon-consume-globaltype.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Updating globals from within an addon

If you're working on a Storybook addon that needs to update the global and refreshes the UI, you can do so. As mentioned previously, the `@storybook/api` package provides the necessary hook for this scenario. You can use the `updateGlobals` function to update any global values you want. 

Also, you can use the `@storybook/addons` and `@storybook/core-events` packages together to trigger the refresh.

For example, if you were working on a [toolbar addon](../addons/addon-types.md#toolbars), and you want to refresh the UI and update the global once the user clicks on a button, like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/addon-consume-and-update-globaltype.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
