import { Button } from './button';
import { Header } from './header';

export default {
  title: 'Example/Header',
  component: Header,
  argsType: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

const Template = (args: any) => ({
  components: [Header, Button],
  state: args,
  template: `<storybook-header 
    user.bind="user" 
    onLogin.delegate="onLogin($event)"
    onLogout.delegate="onLogout($event)" 
    onCreateAccount.delegate="onCreateAccount($event)" />`,
});

export const LoggedIn = Template.bind({});
// @ts-ignore
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
// @ts-ignore
LoggedOut.args = {};
