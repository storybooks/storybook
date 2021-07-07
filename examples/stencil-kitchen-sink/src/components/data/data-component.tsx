/** @jsx h */

import { Component, Prop, h } from '@stencil/core';

export interface RichData {
  foo: string;
}

@Component({
  tag: 'data-component',
  shadow: true,
})
export class DataComponent {
  @Prop() richData: RichData;

  render() {
    return <div>{this.richData.foo}</div>;
  }
}
