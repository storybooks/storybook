import root from '@storybook/global-root';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'rax' || (!options.framework && hasDependency('@storybook/rax'));
}

function load(options: StoryshotsOptions) {
  root.STORYBOOK_ENV = 'rax';

  const storybook = jest.requireActual('@storybook/rax');

  configure({ ...options, storybook });

  return {
    framework: 'rax' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for rax');
    },
    storybook,
  };
}

const raxLoader: Loader = {
  load,
  test,
};

export default raxLoader;
