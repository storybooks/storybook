import renderStorybookUI from '@storybook/ui';
import root from '@storybook/global-root';
import Provider from './provider';
import { importPolyfills } from './conditional-polyfills';

importPolyfills().then(() => {
  const rootEl = root.document.getElementById('root');
  renderStorybookUI(rootEl, new Provider());
});
