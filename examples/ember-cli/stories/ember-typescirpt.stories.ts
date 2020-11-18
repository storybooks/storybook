import { hbs } from 'ember-cli-htmlbars';
import { Story, Meta } from '@storybook/ember/types-6-0';
import type { ButtonArgs } from '../app/components/button';

export default {
  title: 'TypeScript',
} as Meta;

const Template: Story<ButtonArgs> = (args) => ({
  template: hbs`
  <Button @emoji={{this.emoji}} {{on "click" this.onClick}}>
    Glimmer
  </Button>`,
  context: {
    ...args,
    onClick() {
      console.log('click!');
    },
  },
});

export const GlimmerButton: Story<ButtonArgs> = Template.bind({});
GlimmerButton.args = {
  emoji: '✨',
};

GlimmerButton.storyName = 'Glimmer button with TypeScript';
