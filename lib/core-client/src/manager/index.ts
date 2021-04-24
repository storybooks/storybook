import { document } from 'global';
import renderStorybookUI from '@storybook/ui';
import Provider from './provider';
import { importPolyfills } from './conditional-polyfills';

importPolyfills().then(() => {
  const rootEl = document.getElementById('storybook-root');
  renderStorybookUI(rootEl, new Provider());
});
