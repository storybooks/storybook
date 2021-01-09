import Component from '@glimmer/component';

/**
 * An example to showcase the argType inference based in YUI docs
 * @class ArgTypesInferenceExample
 */
export default class ArgTypesInferenceExample extends Component {
  /**
   * Some classname from the app.css
   * @argument className
   * @type string
   */
  className;

  /**
   * The text for the paragraph
   * @argument text
   * @type string
   */
  text;

  /**
   * A toggle
   * @argument toggle
   * @type boolean
   */
  toggle;
}
