import root from '@storybook/global-root';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';
import configure from '../configure';
import { Loader } from '../Loader';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'web-components';
}

function load(options: StoryshotsOptions) {
  root.STORYBOOK_ENV = 'web-components';

  const storybook = jest.requireActual('@storybook/web-components');

  configure({ ...options, storybook });

  return {
    framework: 'web-components' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for web-components');
    },
    storybook,
  };
}

const webComponentsLoader: Loader = {
  load,
  test,
};

export default webComponentsLoader;
