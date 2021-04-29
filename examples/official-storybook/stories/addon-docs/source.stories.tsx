import React from 'react';
// @ts-ignore
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Button from '../../components/TsButton';

export default {
  title: 'Addons/Docs/Source',
  component: Button,
  argTypes: {
    children: { control: 'text' },
    type: { control: 'text' },
  },
  parameters: {
    chromatic: { disable: true },
  },
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'basic',
  somethingElse: { a: 2 },
};

export const NoArgs = () => <Button>no args</Button>;

export const ForceCodeSource = Template.bind({});
ForceCodeSource.args = { ...Basic.args };
ForceCodeSource.parameters = { docs: { source: { type: 'code' } } };

export const CustomSource = Template.bind({});
CustomSource.args = { ...Basic.args };
CustomSource.parameters = { docs: { source: { code: 'custom source' } } };

export const CustomSyntaxHighlighting = Template.bind({});
CustomSyntaxHighlighting.args = { ...Basic.args };
CustomSyntaxHighlighting.parameters = { docs: { source: { prismTheme: vs, language: 'tsx' } } };

export const CustomSyntaxHighlightingDark = Template.bind({});
CustomSyntaxHighlightingDark.args = { ...Basic.args };
CustomSyntaxHighlightingDark.parameters = {
  docs: { source: { prismTheme: vscDarkPlus, language: 'tsx', dark: true } },
};
