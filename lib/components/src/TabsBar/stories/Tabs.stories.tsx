import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { TabsBar } from '../TabsBar';
import { TabsTool } from '../TabsTool';

export default {
  title: 'Basics/TabsBar',
  component: TabsBar,
  argTypes: {
    onSelect: { action: 'onSelect', table: { disable: true, hidden: true } },
    onChange: { action: 'onChange', table: { disable: true, hidden: true } },
    onMenuClose: { action: 'onMenuClose', table: { disable: true, hidden: true } },
    onMenuOpen: { action: 'onMenuOpen', table: { disable: true, hidden: true } },
    onMenuItemSelect: { action: 'onMenuItemSelect', table: { disable: true, hidden: true } },
    tabs: { table: { disable: true, hidden: true } },
    tools: { table: { disable: true, hidden: true } },
    backgroundColor: { control: { type: 'color' } },
    textColor: { control: { type: 'color' } },
    activeColor: { control: { type: 'color' } },
    initial: {
      options: ['canvas', 'docs'],
      control: { type: 'select' },
    },
    selected: {
      options: ['canvas', 'docs'],
      control: { type: 'select' },
    },
  },
  parameters: {
    test: { disable: true },
    storysource: { disable: true },
  },
} as Meta;

const Template: ComponentStory<typeof TabsBar> = (args) => (
  <TabsBar
    {...args}
    tabs={[
      { id: 'canvas', label: 'Canvas', content: 'Show the canvas' },
      { id: 'docs', label: 'Docs', content: 'Show the docs' },
      { id: 'sep-1', type: 'seperator' },
      { id: 'zoom-in', type: 'tool', icon: 'zoom' },
      { id: 'zoom-out', type: 'tool', icon: 'zoomout' },
      { id: 'zoom-reset', type: 'tool', icon: 'zoomreset' },
      { id: 'sep-2', type: 'seperator' },
      {
        id: 'background',
        icon: 'photo',
        type: 'menu',
        menu: [
          { id: 'light', label: 'Light', icon: 'circlehollow', iconPosition: 'right' },
          { id: 'dark', label: 'Dark', icon: 'circle', iconPosition: 'right' },
        ],
      },
      { id: 'grid', icon: 'grid', type: 'button' },
      {
        id: 'viewport',
        icon: 'grow',
        type: 'menu',
        menu: [
          { id: 'small-mobile', label: 'Small Mobile' },
          { id: 'mobile', label: 'Mobile' },
          { id: 'large-mobile', label: 'Large Mobile' },
          { id: 'tablet', label: 'Tablet' },
        ],
      },
      { id: 'sep-3', type: 'seperator' },
      {
        id: 'theme',
        icon: 'circlehollow',
        selected: 'theme-light',
        type: 'menu',
        label: 'Theme',
        menu: [
          { id: 'theme-light', label: 'Light Theme', icon: 'circlehollow', iconPosition: 'right' },
          { id: 'theme-dark', label: 'Dark Theme', icon: 'circle', iconPosition: 'right' },
          {
            id: 'theme-side-by-size',
            label: 'Side by Side',
            icon: 'sidebar',
            iconPosition: 'right',
          },
          { id: 'theme-stacked', label: 'Stacked', icon: 'bottombar', iconPosition: 'right' },
        ],
      },
      {
        id: 'localization',
        icon: 'globe',
        type: 'menu',
        menu: [
          { id: 'en', label: 'English', right: 'en' },
          { id: 'es', label: 'Espanol', right: 'en' },
          { id: 'ch', label: '中文', right: 'ch' },
          { id: 'zh', label: '한국어', right: 'zh' },
        ],
      },
      { id: 'measure', icon: 'ruler', type: 'button' },
      { id: 'outline', icon: 'outline', type: 'button' },
      {
        id: 'accessibility',
        icon: 'accessibility',
        type: 'menu',
        menu: [
          { id: 'blurred', label: 'Blurred Vision' },
          { id: 'deuteranomaly', label: 'Deuteranomaly' },
          { id: 'duteranopia', label: 'Deuteranopia' },
          { id: 'protanomaly', label: 'Protanomaly' },
        ],
      },
    ]}
    tools={
      <>
        <TabsTool icon="expand" />
        <TabsTool icon="sharealt" />
      </>
    }
  />
);

export const Controllable = Template.bind({});
Controllable.args = {
  bordered: true,
  absolute: false,
  rounded: false,
  backgroundColor: '',
  selected: '',
  staticTools: false,
};
