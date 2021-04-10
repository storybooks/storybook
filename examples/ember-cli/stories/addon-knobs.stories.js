import { hbs } from 'ember-cli-htmlbars';
import { withKnobs, text, color, boolean } from '@storybook/addon-knobs';

export default {
  title: 'Addon/Knobs',
  decorators: [withKnobs],
  parameters: {
    options: { selectedPanel: 'storybook/knobs/panel' },
  },
};

export const WithText = () => ({
  template: hbs`
      <WelcomeBanner
        @style={{if this.hidden "display: none"}}
        @backgroundColor={{this.backgroundColor}}
        @titleColor={{this.titleColor}}
        @subTitleColor={{this.subTitleColor}}
        @title={{this.title}}
        @subtitle={{this.subtitle}}
      />
    `,
  context: {
    hidden: boolean('hidden', false),
    backgroundColor: color('backgroundColor', '#FDF4E7'),
    titleColor: color('titleColor', '#DF4D37'),
    subTitleColor: color('subTitleColor', '#B8854F'),
    title: text('title', 'Welcome to storybook'),
    subtitle: text('subtitle', 'This environment is completely editable'),
  },
});

WithText.storyName = 'with text';
