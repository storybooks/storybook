import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Header extends Component {
  user = null;

  @action
  onLogin() {}

  @action
  onLogout() {}

  @action
  onCreateAccount() {}
}
