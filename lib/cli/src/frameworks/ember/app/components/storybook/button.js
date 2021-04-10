import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Button extends Component {
  /**
   * Is this the principal call to action on the page?
   */
  primary = false;

  /**
   * What background color to use
   */
  backgroundColor = undefined;

  /**
   * How large should the button be?
   */
  size = 'medium';

  /**
   * Button contents
   *
   * @required
   */
  label = 'Button';

  @action
  onClick() {}
}
