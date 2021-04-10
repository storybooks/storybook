import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Addon/Controls',
  component: 'WelcomeBanner',
  parameters: {
    docs: {
      iframeHeight: 200,
    },
    options: { showPanel: true, selectedPanel: 'storybook/controls/panel' },
  },
  argTypes: {
    backgroundColor: {
      description: 'background color of the bounding box',
      control: {
        type: 'color',
      },
    },
    titleColor: {
      description: 'Color of the title text',
      control: {
        type: 'color',
      },
    },
    subTitleColor: {
      description: 'Color of the sub title text',
      control: {
        type: 'color',
      },
    },
    title: {
      description: 'Title text',
    },
    subtitle: {
      description: 'Subtitle text',
    },
  },
};

export const Basic = (args) => ({
  template: hbs`
    <WelcomeBanner
      @backgroundColor={{this.backgroundColor}}
      @titleColor={{this.titleColor}}
      @subTitleColor={{this.subTitleColor}}
      @title={{this.title}}
      @subtitle={{this.subtitle}}
    />
  `,
  context: args,
});
Basic.args = {
  backgroundColor: '#FDF4E7',
  titleColor: '#DF4D37',
  subTitleColor: '#B8854F',
  title: 'Welcome to storybook',
  subtitle: 'This environment is completely editable',
};
