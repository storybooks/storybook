# StoryShots + [Puppeteer](https://github.com/GoogleChrome/puppeteer)

## Getting Started

Add the following modules into your app.

```sh
npm install @storybook/addon-storyshots-puppeteer puppeteer --save-dev
```

⚠️ As of Storybook 5.3 `puppeteer` is no more included in addon dependencies and must be added to your project directly.

## Configure Storyshots for Puppeteer tests

⚠️ **React-native** is **not supported** by this test function.

When willing to run Puppeteer tests for your stories, you have two options:

- Have a storybook running (ie. accessible via http(s), for instance using `npm run storybook`)
- Have a static build of the storybook (for instance, using `npm run build-storybook`)

Then you will need to reference the storybook URL (`file://...` if local, `http(s)://...` if served)

## _puppeteerTest_

Allows to define arbitrary Puppeteer tests as `story.parameters.puppeteerTest` function.

You can either create a new Storyshots instance or edit the one you previously used:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({ suite: 'Puppeteer storyshots', test: puppeteerTest() });
```

Then, in your stories:

```js
export const myExample = () => {
  ...
};
myExample.parameters = {
  async puppeteerTest(page) {
    const element = await page.$('<some-selector>');
    await element.click();
    expect(something).toBe(something);
  },
};
```

This will assume you have a storybook running on at _<http://localhost:6006>_.
Internally here are the steps:

- Launches a Chrome headless using [puppeteer](https://github.com/GoogleChrome/puppeteer)
- Browses each stories (calling _<http://localhost:6006/iframe.html?...>_ URL),
- Runs the `parameters.puppeteerTest` function if it's defined.

### Specifying the storybook URL

If you want to set specific storybook URL, you can specify via the `storybookUrl` parameter, see below:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({ storybookUrl: 'http://my-specific-domain.com:9010' }),
});
```

The above config will use _<https://my-specific-domain.com:9010>_ for tests. You can also use query parameters in your URL (e.g. for setting a different background for your storyshots, if you use `@storybook/addon-backgrounds`).

You may also use a local static build of storybook if you do not want to run the webpack dev-server:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({
    storybookUrl: 'file:///path/to/my/storybook-static',
    // storybookUrl: 'file://${path.resolve(__dirname, '../storybook-static')}'
  }),
});
```

### Specifying options to _goto()_ (Puppeteer API)

You might use `getGotoOptions` to specify options when the storybook is navigating to a story (using the `goto` method). Will be passed to [Puppeteer .goto() fn](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options)

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';

const getGotoOptions = ({ context, url }) => {
  return {
    waitUntil: 'networkidle0',
  };
};

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({ storybookUrl: 'http://localhost:6006', getGotoOptions }),
});
```

### Specifying custom Chrome executable path (Puppeteer API)

You might use `chromeExecutablePath` to specify the path to a different version of Chrome, without downloading Chromium. Will be passed to [Runs a bundled version of Chromium](https://github.com/GoogleChrome/puppeteer#default-runtime-settings)

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';

const chromeExecutablePath = '/usr/local/bin/chrome';

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({ storybookUrl: 'http://localhost:6006', chromeExecutablePath }),
});
```

### Specifying a custom Puppeteer `browser` instance

You might use the async `getCustomBrowser` function to obtain a custom instance of a Puppeteer `browser` object. This will prevent `storyshots-puppeteer` from creating its own `browser`. It will create and close pages within the `browser`, and it is your responsibility to manage the lifecycle of the `browser` itself.

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';
import puppeteer from 'puppeteer';

(async function () {
  initStoryshots({
    suite: 'Puppeteer storyshots',
    test: puppeteerTest({
      storybookUrl: 'http://localhost:6006',
      getCustomBrowser: () => puppeteer.connect({ browserWSEndpoint: 'ws://yourUrl' }),
    }),
  });
})();
```

### Customizing a `page` instance

Sometimes, there is a need to customize a page before it calls the `goto` api.

An example of device emulation:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer';
const devices = require('puppeteer/DeviceDescriptors');

const iPhone = devices['iPhone 6'];

function customizePage(page) {
  return page.emulate(iPhone);
}

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({
    storybookUrl: 'http://localhost:6006',
    customizePage,
  }),
});
```

### Specifying setup and tests timeout

By default, `@storybook/addon-storyshots-puppeteer` uses 15 second timeouts for browser setup and test functions.
Those can be customized with `setupTimeout` and `testTimeout` parameters.

### Integrate Puppeteer storyshots with regular app

You may want to use another Jest project to run your Puppeteer storyshots as they require more resources: Chrome and Storybook built/served.
You can find a working example of this in the [official-storybook](https://github.com/storybookjs/storybook/tree/master/examples/official-storybook) example.

### Integrate Puppeteer storyshots with [Create React App](https://github.com/facebookincubator/create-react-app)

You have two options here, you can either:

- Add the storyshots configuration inside any of your `test.js` file. You must ensure you have either a running storybook or a static build available.

- Create a custom test file using Jest outside of the CRA scope:

  A more robust approach would be to separate existing test files ran by create-react-app (anything `(test|spec).js` suffixed files) from the test files to run Puppeteer storyshots.
  This use case can be achieved by using a custom name for the test file, ie something like `puppeteer-storyshots.runner.js`. This file will contain the `initStoryshots` call with Puppeteer storyshots configuration.
  Then you will create a separate script entry in your package.json, for instance

  ```json
  {
    "scripts": {
      "puppeteer-storyshots": "jest puppeteer-storyshots.runner.js --config path/to/custom/jest.config.json"
    }
  }
  ```

  Note that you will certainly need a custom config file for Jest as you run it outside of the CRA scope and thus you do not have the built-in config.

  Once that's setup, you can run `npm run puppeteer-storyshots`.

### Reminder

Puppeteer launches a web browser (Chrome) internally.

The browser opens a page (either using the static build of storybook or a running instance of Storybook)

If you run your test without either the static build or a running instance, this wont work.

To make sure your tests run against the latest changes of your Storybook, you must keep your static build or running Storybook up-to-date.
This can be achieved by adding a step before running the test ie: `npm run build-storybook && npm run image-snapshots`.
If you run the Puppeteer storyshots against a running Storybook in dev mode, you don't have to worry about the stories being up-to-date because the dev-server is watching changes and rebuilds automatically.

## _axeTest_

Runs [Axe](https://www.deque.com/axe/) accessibility checks and verifies that they pass using [jest-puppeteer-axe](https://github.com/WordPress/gutenberg/tree/master/packages/jest-puppeteer-axe).

```js
import initStoryshots from '@storybook/addon-storyshots';
import { axeTest } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({ suite: 'A11y checks', test: axeTest() });
```

For configuration, it uses the same `story.parameters.a11y` parameter as [`@storybook/addon-a11y`](https://github.com/storybookjs/storybook/tree/next/addons/a11y#parameters)

## _imageSnapshots_

Generates and compares screenshots of your stories using [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot).

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({ suite: 'Image storyshots', test: imageSnapshot() });
```

It saves all images under \_\_image_snapshots\_\_ folder.

### Specifying options to _jest-image-snapshots_

If you wish to customize [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot), then you can provide a `getMatchOptions` parameter that should return the options config object. Additionally, you can provide `beforeScreenshot` which is called before the screenshot is captured and a `afterScreenshot` handler which is called after the screenshot and receives the just created image.

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
const getMatchOptions = ({ context: { kind, story }, url }) => {
  return {
    failureThreshold: 0.2,
    failureThresholdType: 'percent',
  };
};
const beforeScreenshot = (page, { context: { kind, story }, url }) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 600)
  );
};
const afterScreenshot = ({ image, context }) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 600)
  );
};
initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:6006',
    getMatchOptions,
    beforeScreenshot,
    afterScreenshot,
  }),
});
```

`getMatchOptions` receives an object: `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot.

`beforeScreenshot` receives the [Puppeteer page instance](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page) and an object: `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot. `beforeScreenshot` is part of the promise chain and is called after the browser navigation is completed but before the screenshot is taken. It allows for triggering events on the page elements and delaying the screenshot and can be used avoid regressions due to mounting animations.

`afterScreenshot` receives the created image from puppeteer.

### Specifying options to _screenshot()_ (Puppeteer API)

You might use `getScreenshotOptions` to specify options for screenshot. Will be passed to [Puppeteer .screenshot() fn](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions)

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
const getScreenshotOptions = ({ context, url }) => {
  return {
    encoding: 'base64', // encoding: 'base64' is a property required by puppeteer
    fullPage: false, // Do not take the full page screenshot. Default is 'true' in Storyshots.,
  };
};
initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'http://localhost:6006', getScreenshotOptions }),
});
```

`getScreenshotOptions` receives an object `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot.

To create a screenshot of just a single element (with its children), rather than the page or current viewport, an ElementHandle can be returned from `beforeScreenshot`:
```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

const beforeScreenshot = (page) => page.$('#storybook-root > *');

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'http://localhost:6006', beforeScreenshot }),
});
```