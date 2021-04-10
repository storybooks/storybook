import { hbs } from 'ember-cli-htmlbars';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Addon/Links',
  parameters: {
    options: { showPanel: true },
  },
};

export const GoToWelcome = () => ({
  template: hbs`<button {{action onClick}}>This button brings you to welcome</button>`,
  context: {
    onClick: linkTo('Welcome'),
  },
});

GoToWelcome.storyName = 'Go to welcome';
