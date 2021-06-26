import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Content } from './Content';
import { ScrollArea } from '../ScrollArea';

export default {
  title: 'Basics/ScrollBars/Stories',
  component: ScrollArea,
  parameters: {
    test: { disable: true },
    actions: { disable: true },
    controls: { disable: true },
  },
} as ComponentMeta<typeof ScrollArea>;

export const Default = () => (
  <ScrollArea>
    <Content />
  </ScrollArea>
);

export const DefaultAbsolute = () => (
  <ScrollArea absolute>
    <Content />
  </ScrollArea>
);

export const DefaultFixedContentWidth = () => (
  <ScrollArea>
    <Content style={{ width: 4000 }} />
  </ScrollArea>
);

export const AbsoluteFixedContentWidth = () => (
  <ScrollArea absolute>
    <Content style={{ width: 4000 }} />
  </ScrollArea>
);

export const FixedAreaAndContent = () => (
  <ScrollArea style={{ height: 250, width: 250 }}>
    <Content style={{ width: 4000 }} />
  </ScrollArea>
);

export const BorderedArea = () => (
  <ScrollArea style={{ height: 450, border: '10px solid #FF0000' }}>
    <div style={{ padding: 32 }}>
      <h1>Do not attempt to style the ScrollArea itself</h1>
      <h2>instead use the ContainerProps or ContentProps</h2>
      <p>
        Preferably ScrollArea knows nothing about styling other than what is given through
        properties
      </p>
      <p>
        Should you however need to style the container use the properties ContainerProps or
        ContentProps to add any valid React.HTMLAttribute to these nodes
      </p>
    </div>
    <Content />
  </ScrollArea>
);

export const BorderedContainerExaggerated = () => (
  <ScrollArea
    sliderColor="#FF0000"
    sliderOpacity={1}
    style={{ height: 250, width: 250 }}
    containerProps={{ style: { border: '14px solid #0000FF' } }}
  >
    <Content style={{ width: 4000 }} />
  </ScrollArea>
);

export const BorderedContainerUseful = () => (
  <ScrollArea
    style={{ height: 250, width: 250 }}
    sliderColor="#CCCCCC"
    sliderOpacity={1}
    containerProps={{ style: { border: '1px solid #CCCCCC' } }}
  >
    <Content style={{ width: 4000 }} />
  </ScrollArea>
);
