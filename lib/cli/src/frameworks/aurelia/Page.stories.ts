import { Button } from './button';
import { Header } from './header';
import { Page } from './page';

import * as HeaderStories from './Header.stories';

export default {
  title: 'Example/Page',
  component: Page,
  argsType: {
    onLogin: { action: 'onLogin' },
    onLogout: { action: 'onLogout' },
    onCreateAccount: { action: 'onCreateAccount' },
  },
};

const Template = (args: any) => ({
  components: [Page, Header, Button],
  state: args,
  template: `<storybook-page 
    user.bind="user" 
    onLogin.delegate="onLogin($event)"
    onLogout.delegate="onLogout($event)" 
    onCreateAccount.delegate="onCreateAccount($event)" />`,
});

export const LoggedIn = Template.bind({});
// @ts-ignore
LoggedIn.args = {
  // @ts-ignore
  ...HeaderStories.LoggedIn.args,
};

export const LoggedOut = Template.bind({});
// @ts-ignore
LoggedOut.args = {
  // @ts-ignore
  ...HeaderStories.LoggedOut.args,
};
