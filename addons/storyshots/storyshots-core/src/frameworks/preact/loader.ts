/** @jsxRuntime classic */
/** @jsx h */

import root from '@storybook/global-root';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';
import configure from '../configure';
import hasDependency from '../hasDependency';
import { Loader } from '../Loader';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'preact' || (!options.framework && hasDependency('@storybook/preact'))
  );
}

function load(options: StoryshotsOptions) {
  root.STORYBOOK_ENV = 'preact';

  const storybook = jest.requireActual('@storybook/preact');

  configure({ ...options, storybook });

  return {
    framework: 'preact' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for preact');
    },
    storybook,
  };
}

const preactLoader: Loader = {
  load,
  test,
};

export default preactLoader;
