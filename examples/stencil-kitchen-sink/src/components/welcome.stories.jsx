/** @jsx h */

import { h } from '@stencil/core';

export default {
  title: 'Welcome',
};

export const Default = () => {
  return (
    <container-component>
      <div>Header</div>
      <div>
        <data-component richData={{ foo: 'bar' }} />
      </div>
      <div>Footer</div>
    </container-component>
  );
};
