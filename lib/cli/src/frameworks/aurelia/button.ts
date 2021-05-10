import { customElement, bindable } from 'aurelia';

@customElement({
  name: 'storybook-button',
  template: `<template>
  <require from="button.css"></require>
  <button class="\${classes()}" css="background-color: \${backgroundColor};">\${label}</button>
</template>
`,
})
export class Button {
  /**
   * Button contents
   *
   * @required
   */
  @bindable
  label = 'Button';

  /**
   * Is this the principal call to action on the page?
   */
  @bindable
  primary = false;

  /**
   * How large should the button be?
   */
  @bindable
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * What background color to use
   */
  @bindable
  backgroundColor?: string;

  classes(): string {
    const mode = this.primary ? 'storybook-button--primary' : 'storybook-button--secondary';

    return ['storybook-button', `storybook-button--${this.size}`, mode].join(' ');
  }
}
