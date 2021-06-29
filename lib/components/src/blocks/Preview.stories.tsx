import root from '@storybook/global-root';
import { styled } from '@storybook/theming';
import React from 'react';
import { Button } from '../Button/Button';
import { Spaced } from '../spaced/Spaced';
import { Preview } from './Preview';
import * as Source from './Source.stories';
import { Story } from './Story';

const { location } = root;

export default {
  title: 'Docs/Preview',
  component: Preview,
};

export const CodeCollapsed = () => (
  <Preview isExpanded={false} withSource={Source.JSX.args}>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const CodeExpanded = () => (
  <Preview isExpanded withSource={Source.JSX.args}>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const CodeError = () => (
  <Preview isExpanded withSource={Source.SourceUnavailable.args}>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const Single = () => (
  <Preview>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const Row = () => (
  <Preview>
    <Button secondary>Button 1</Button>
    <Button secondary>Button 2</Button>
    <Button secondary>Button 3</Button>
    <Button secondary>Button 4</Button>
    <Button secondary>Button 5</Button>
    <Button secondary>Button 6</Button>
    <Button secondary>Button 7</Button>
  </Preview>
);

export const Column = () => (
  <Preview isColumn>
    <Button secondary>Button 1</Button>
    <Button secondary>Button 2</Button>
    <Button secondary>Button 3</Button>
  </Preview>
);

export const GridWith3Columns = () => (
  <Preview columns={3}>
    <Button secondary>Button 1</Button>
    <Button secondary>Button 2</Button>
    <Button secondary>Button 3</Button>
    <Button secondary>Button 4</Button>
    <Button secondary>Button 5</Button>
    <Button secondary>Button 6</Button>
    <Button secondary>Button 7 long long long long long title</Button>
    <Button secondary>Button 8</Button>
    <Button secondary>Button 9</Button>
    <Button secondary>Button 10</Button>
    <Button secondary>Button 11</Button>
    <Button secondary>Button 12</Button>
    <Button secondary>Button 13</Button>
    <Button secondary>Button 14</Button>
    <Button secondary>Button 15</Button>
    <Button secondary>Button 16</Button>
    <Button secondary>Button 17</Button>
    <Button secondary>Button 18</Button>
    <Button secondary>Button 19</Button>
    <Button secondary>Button 20</Button>
  </Preview>
);

const buttonFn = () => <Button secondary>Hello Button</Button>;

export const WithToolbar = () => (
  <Preview withToolbar>
    <Story inline storyFn={buttonFn} title="with toolbar" />
  </Preview>
);

const Horizontal = styled((props) => <Spaced col={1} {...props} />)({
  display: 'grid',
  gridTemplateColumns: '100px calc(100vw + 100px) 100px',
});

export const Wide = () => (
  <Preview withToolbar>
    <Horizontal>
      <div>START</div>
      <div>middle</div>
      <div>END</div>
    </Horizontal>
  </Preview>
);

export const WithToolbarMulti = () => (
  <Preview withToolbar>
    <Story inline storyFn={buttonFn} title="story1" />
    <Story inline storyFn={buttonFn} title="story2" />
  </Preview>
);

export const WithFullscreenSingle = () => (
  <Preview withToolbar>
    <Story inline storyFn={buttonFn} title="story1" parameters={{ layout: 'fullscreen' }} />
  </Preview>
);

export const WithFullscreenMulti = () => (
  <Preview withToolbar>
    <Story inline storyFn={buttonFn} title="story1" parameters={{ layout: 'fullscreen' }} />
    <Story inline storyFn={buttonFn} title="story2" parameters={{ layout: 'fullscreen' }} />
  </Preview>
);

export const WithCenteredSingle = () => (
  <Preview withToolbar>
    <Story inline storyFn={buttonFn} title="story1" parameters={{ layout: 'centered' }} />
  </Preview>
);

export const WithCenteredMulti = () => (
  <Preview withToolbar>
    <Story inline storyFn={buttonFn} title="story1" parameters={{ layout: 'centered' }} />
    <Story inline storyFn={buttonFn} title="story2" parameters={{ layout: 'centered' }} />
  </Preview>
);

export const WithAdditionalActions = () => (
  <Preview
    additionalActions={[
      {
        title: 'Open on GitHub',
        onClick: () => {
          location.href =
            'https://github.com/storybookjs/storybook/blob/next/lib/components/src/blocks/Preview.stories.tsx#L140-L147';
        },
      },
    ]}
  >
    <Button secondary>Button 1</Button>
  </Preview>
);
