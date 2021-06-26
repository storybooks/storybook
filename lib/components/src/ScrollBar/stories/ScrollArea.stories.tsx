import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Content } from './Content';
import { ScrollArea } from '../ScrollArea';

export default {
  title: 'Basics/ScrollBars',
  component: ScrollArea,
  argTypes: {
    sliderColor: { control: { type: 'color' } },
    sliderSize: { control: { type: 'number' } },
    sliderPadding: { control: { type: 'number' } },
    sliderOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  parameters: {
    test: { disable: true },
    actions: { disable: true },
    layout: 'centered',
  },
} as ComponentMeta<typeof ScrollArea>;

const Template: ComponentStory<typeof ScrollArea> = (args) => (
  <ScrollArea
    {...args}
    style={{
      maxWidth: 800,
      maxHeight: 400,
      borderRadius: 4,
      border: '1px solid #cccccc',
      backgroundColor: '#ffffff',
      color: '#000000',
    }}
  >
    <Content
      style={{
        width: 1200,
      }}
    />
  </ScrollArea>
);

export const Controllable = Template.bind({});
Controllable.args = {
  vertical: true,
  verticalPosition: 'right',
  horizontal: true,
  horizontalPosition: 'bottom',
  sliderOpacity: 0.5,
  showOn: 'always',
  absolute: false,
};
