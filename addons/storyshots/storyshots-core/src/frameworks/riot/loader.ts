import root from '@storybook/global-root';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';

function mockRiotToIncludeCompiler() {
  jest.mock('riot', () => jest.requireActual('riot/riot.js'));
}

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'riot' || (!options.framework && hasDependency('@storybook/riot'));
}

function load(options: StoryshotsOptions) {
  root.STORYBOOK_ENV = 'riot';
  mockRiotToIncludeCompiler();

  const storybook = jest.requireActual('@storybook/riot');

  configure({ ...options, storybook });

  return {
    framework: 'riot' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for riot');
    },
    storybook,
  };
}

const riotLoader: Loader = {
  load,
  test,
};

export default riotLoader;
