import React from 'react';
import { Source, SourceError } from './Source';

export default {
  title: 'Docs/Source',
  component: Source,
};

const jsxCode = `
<MyComponent boolProp scalarProp={1} complexProp={{ foo: 1, bar: '2' }}>
  <SomeOtherComponent funcProp={(a) => a.id} />
</MyComponent>
`;

export const JSX = (args) => <Source {...args} />;
JSX.args = {
  code: jsxCode,
  language: 'jsx',
  format: false,
};

const cssCode = `
@-webkit-keyframes blinker {
  from { opacity: 1.0; }
  to { opacity: 0.0; }
}

.waitingForConnection {
  -webkit-animation-name: blinker;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: cubic-bezier(.5, 0, 1, 1);
  -webkit-animation-duration: 1.7s;
}
`;

export const CSS = (args) => <Source {...args} />;
CSS.args = {
  code: cssCode,
  language: 'css',
  format: false,
};

export const NoStory = (args) => <Source {...args} />;
NoStory.args = {
  error: SourceError.NO_STORY,
  format: false,
};

export const sourceUnavailable = () => (
  <Source error={SourceError.SOURCE_UNAVAILABLE} format={false} />
);

export const formattedJsx = () => <Source code={jsxCode} format language="jsx" />;

export const formattedCss = () => <Source code={cssCode} format language="css" />;

const htmlCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title></title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./storybook.ts"></script>
    <div class="sb-errordisplay sb-wrapper">
      <div id="error-message" class="sb-heading"></div>
      <pre class="sb-errordisplay_code"><code id="error-stack"></code></pre>
    </div>
  </body>
</html>
`;

export const formattedHtml = () => <Source code={htmlCode} format language="html" />;
export const SourceUnavailable = (args) => <Source {...args} />;
SourceUnavailable.args = {
  error: SourceError.SOURCE_UNAVAILABLE,
  format: false,
};
