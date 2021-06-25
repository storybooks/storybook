import global from 'global';
import renderStorybookUI from '@storybook/ui';
import Provider from './provider';
import { importPolyfills } from './conditional-polyfills';

const { document } = global;

importPolyfills().then(() => {
  const rootElement = document.getElementById('root');
  renderStorybookUI(rootElement, new Provider());
});
