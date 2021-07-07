/** @jsx h */

import { Component, h } from '@stencil/core';

@Component({
  tag: 'container-component',
  shadow: true,
})
export class ContainerComponent {
  render() {
    return (
      <div>
        This is a slot
        <div>
          <slot />
        </div>
      </div>
    );
  }
}
