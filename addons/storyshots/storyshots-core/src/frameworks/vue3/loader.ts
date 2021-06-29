import root from '@storybook/global-root';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'vue3' || (!options.framework && hasDependency('@storybook/vue3'));
}

function load(options: StoryshotsOptions) {
  root.STORYBOOK_ENV = 'vue3';

  const storybook = jest.requireActual('@storybook/vue3');

  configure({ ...options, storybook });

  return {
    framework: 'vue3' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for Vue 3');
    },
    storybook,
  };
}

const vueLoader: Loader = {
  load,
  test,
};

export default vueLoader;
