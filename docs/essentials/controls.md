---
title: 'Controls'
---

Storybook Controls gives you a graphical UI to interact with a component's arguments dynamically, without needing to code. It creates an addon panel next to your component examples ("stories"), so you can edit them live.

<video autoPlay muted playsInline loop>
  <source
    src="addon-controls-optimized.mp4"
    type="video/mp4"
  />
</video>

Controls does not require any modification to your components. Stories for controls are:

- Convenient. Auto-generate controls based on React/Vue/Angular/etc. components.
- Portable. Reuse your interactive stories in documentation, tests, and even in designs.
- Rich. Customize the controls and interactive data to suit your exact needs.

To use the Controls addon, you need to write your stories using [args](../writing-stories/args.md). Storybook will automatically generate UI controls based on your args and what it can infer about your component; but you can configure the controls further using [argTypes](../api/argtypes.md), see below.

<div class="aside">

If you have written stories in the older pre-Storybook 6 style, you may want to read the [args & controls migration guide](https://medium.com/storybookjs/storybook-6-migration-guide-200346241bb5) to help understand how to convert your stories for args.

</div>

## Choosing the control type

By default, Storybook will choose a control for each arg based on the initial value of the arg. This works well with some kind of args, such as boolean values or free-text strings, but in other cases you want a more restricted control.

<!-- prettier-ignore-start -->

<FeatureSnippets
  paths={[
    'essentials/auto-generated-controls/react.mdx',
    'essentials/auto-generated-controls/vue.mdx',
    'essentials/auto-generated-controls/angular.mdx',
    'essentials/auto-generated-controls/web-components.mdx',
    'essentials/auto-generated-controls/ember.mdx',
    'essentials/auto-generated-controls/fallback.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

For instance, suppose you have a `backgroundColor` arg on your story:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-controls-red-input.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

By default, Storybook will render a free text input for the `backgroundColor` arg:

![Essential addon Controls using a string](./addon-controls-args-background-string.png)

This works as long as you type a valid string into the auto-generated text control, but it's not the best UI for picking a color. Let’s replace it with Storybook’s color picker component.

We can specify which controls get used by declaring a custom [argType](../api/argtypes.md) for the `backgroundColor` property. ArgTypes encode basic metadata for args, such as name, description, defaultValue for an arg. These get automatically filled in by Storybook Docs.

ArgTypes can also contain arbitrary annotations which can be overridden by the user. Since `backgroundColor` is a property of the component, let's put that annotation on the default export.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-controls-color-picker.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

This replaces the input with a color picker for a more intuitive developer experience.

![Essential Control addon with a color picker](./addon-controls-args-background-color.png)

## Fully custom args

Up until now, we only used auto-generated controls based on the component we're writing stories for. If we are writing [complex stories](../workflows/stories-for-multiple-components.md) we may want to add controls for args that aren’t part of the component.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/table-story-fully-customize-controls.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

By default, Storybook will add controls for all args that:

- It infers from the component definition [if your framework supports it](../api/frameworks-feature-support.md).

- Appear in the list of args for your story.

You can determine the control by using `argTypes` in each case.

## Configuration

The Controls addon can be configured in two ways:

- Individual controls can be configured via control annotations.
- The addon's appearance can be configured via parameters.

### Annotation

As shown above, you can configure individual controls with the `control` annotation in the [argTypes](../api/argtypes) field of either a component or story.

Here is the full list of available controls you can use:

| Data Type   | Control Type | Description                                                    |    Options     |
| :---------- | :----------: | :------------------------------------------------------------- | :------------: |
| **array**   |    array     | serialize array into a comma-separated string inside a textbox |   separator    |
| **boolean** |   boolean    | checkbox input                                                 |       -        |
| **number**  |    number    | a numeric text box input                                       | min, max, step |
|             |    range     | a range slider input                                           | min, max, step |
| **object**  |    object    | json editor text input                                         |       -        |
| **enum**    |    radio     | radio buttons input                                            |    options     |
|             | inline-radio | inline radio buttons input                                     |    options     |
|             |    check     | multi-select checkbox input                                    |    options     |
|             | inline-check | multi-select inline checkbox input                             |    options     |
|             |    select    | select dropdown input                                          |    options     |
|             | multi-select | multi-select dropdown input                                    |    options     |
| **string**  |     text     | simple text input                                              |       -        |
|             |    color     | color picker input that assumes strings are color values       |       -        |
|             |     date     | date picker input                                              |       -        |

If you need to customize a control to use a enum data type in your story, for instance the `inline-radio` you can do it like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/widget-story-controls-enum.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
If you don't provide a specific one, it defaults to:
- a radio type for enums with 5 or less elements
- a select control type with more than 5 elements
</div>

If you need to customize a control for a number data type in your story, you can do it like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/gizmo-story-controls-customization.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
If you don't provide a specific one, it defaults to the number control type.
</div>

### Parameters

[Parameters](../writing-stories/parameters.md) support the following control configurations, either globally or on a story.

#### Show full documentation for each property

Since Controls is built on the same engine as Storybook Docs, it can also show property documentation alongside your controls using the expanded parameter (defaults to false). This means you embed a complete [ArgsTable](../writing-docs/doc-blocks.md#argstable) doc block in the controls pane. The description and default value rendering can be [customized](#fully-custom-args) in the same way as the doc block.

To enable expanded mode globally, add the following to [`.storybook/preview.js`](../configure/overview.md#configure-story-rendering):

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-expanded-controls.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

And here's what the resulting UI looks like:

![Controls addon expanded](./addon-controls-expanded.png)

#### Hide NoControls warning

If you don't plan to handle the control args inside your Story, you can remove the warning with the `controls.hideNoControlsWarning` parameter field.  You can hide the warning on a story using the `parameters` object like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/button-story-hide-nocontrols-warning.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
