import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'Addon/Backgrounds',
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#eeeeee' },
        { name: 'dark', value: '#222222' },
      ],
    },
  },
};

export const Story1 = () => ({
  template: hbs`<button>You should be able to switch backgrounds for this story. Click the background button in the toolbar to toggle backgrounds.</button>`,
});

Story1.storyName = 'story 1';

export const Story2 = () => ({
  template: hbs`<button>This one too!</button>`,
});

Story2.storyName = 'story 2';
