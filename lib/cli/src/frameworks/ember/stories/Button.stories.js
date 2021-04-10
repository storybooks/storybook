import { hbs } from 'ember-cli-htmlbars';
import './button.css';

export default {
  title: 'Storybook/Button',
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

const Template = (args) => ({
  template: hbs`
    <Storybook::Button
      @backgroundColor={{this.backgroundColor}}
      @label={{this.label}}
      @primary={{this.primary}}
      @onClick={{this.onClick}}
    />
  `,
  context: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
