import { hbs } from 'ember-cli-htmlbars';
import * as HeaderStories from './Header.stories';
import './page.css';

export default {
  title: 'Storybook/Page',
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

const Template = (args) => ({
  template: hbs`
    <Storybook::Page
      @user={{this.user}}
      @onLogin={{this.onLogin}}
      @onLogout={{this.onLogout}}
      @onCreateAccount={{this.onCreateAccount}}
    />
  `,
  context: args,
});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
};
