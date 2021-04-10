import { hbs } from 'ember-cli-htmlbars';
import './header.css';

export default {
  title: 'Storybook/Header',
  argTypes: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

const Template = (args) => ({
  template: hbs`
    <Storybook::Header
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
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
