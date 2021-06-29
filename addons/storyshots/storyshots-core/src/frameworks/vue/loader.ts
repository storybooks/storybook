import root from '@storybook/global-root';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';

function mockVueToIncludeCompiler() {
  jest.mock('vue', () => jest.requireActual('vue/dist/vue.common.js'));
}

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'vue' || (!options.framework && hasDependency('@storybook/vue'));
}

function load(options: StoryshotsOptions) {
  root.STORYBOOK_ENV = 'vue';
  mockVueToIncludeCompiler();

  const storybook = jest.requireActual('@storybook/vue');

  configure({ ...options, storybook });

  return {
    framework: 'vue' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for vue');
    },
    storybook,
  };
}

const vueLoader: Loader = {
  load,
  test,
};

export default vueLoader;
