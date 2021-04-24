# storybook-addon-a11y

This storybook addon can be helpful to make your UI components more accessible.

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/HEAD/addons/a11y/docs/screenshot.png)

## Getting started

First, install the addon.

```sh
$ yarn add @storybook/addon-a11y --dev
```

Add this line to your `main.js` file (create this file inside your storybook config directory if needed).

```js
module.exports = {
  addons: ['@storybook/addon-a11y'],
};
```

```js
import React from 'react';

export default {
  title: 'button',
};

export const accessible = () => <button>Accessible button</button>;

export const inaccessible = () => (
  <button style={{ backgroundColor: 'red', color: 'darkRed' }}>Inaccessible button</button>
);
```

If you wish to selectively disable `a11y` checks for a subset of stories, you can control this with story parameters:

```js
export const MyNonCheckedStory = () => <SomeComponent />;
MyNonCheckedStory.parameters = {
  a11y: { disable: true },
};
```

## Parameters

For more customizability use parameters to configure [aXe options](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure).
You can override these options [at story level too](https://storybook.js.org/docs/react/configure/features-and-behavior#per-story-options).

```js
import React from 'react';
import { storiesOf, addDecorator, addParameters } from '@storybook/react';

export default {
  title: 'button',
  parameters: {
    a11y: {
      // optional selector which element to inspect
      element: '#storybook-root',
      // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
      config: {},
      // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
      options: {},
      // optional flag to prevent the automatic check
      manual: true,
    },
  },
};

export const accessible = () => <button>Accessible button</button>;

export const inaccessible = () => (
  <button style={{ backgroundColor: 'red', color: 'darkRed' }}>Inaccessible button</button>
);
```

## Roadmap

- Make UI accessible
- Show in story where violations are.
- Add more example tests
- Add tests
- Make CI integration possible
