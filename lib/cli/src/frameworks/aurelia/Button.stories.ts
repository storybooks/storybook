// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Button } from './button';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    onClick: { action: 'onClick' },
  },
};

const Template = (args: any) => ({
  components: [Button],
  state: args,
  template: `<storybook-button 
    label.bind="label" 
    primary.bind="primary" 
    background-color.bind="backgroundColor"
    size.bind="size"
    click.delegate="onClick($event)" />`,
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
// @ts-ignore
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
// @ts-ignore
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
// @ts-ignore
Small.args = {
  size: 'small',
  label: 'Button',
};
