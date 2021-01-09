import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Addon/Controls',
  component: 'ArgTypesInferenceExample',
  argTypes: {
    className: {
      control: {
        type: 'select',
        options: ['text-align-center', 'link', 'code', 'codeBlock', 'note'],
      },
    },
  },
};

const Template = (args) => ({
  template: hbs`<ArgTypesInferenceExample @className={{this.className}} @text={{this.text}} @toggle={{this.toggle}}/>`,
  context: args,
});

export const ArgTypesInference = Template.bind({});

export const PresetArgs = Template.bind({});
PresetArgs.args = { text: 'Hello!' };
