import { resolvePathInStorybookCache } from '@storybook/core-common';
import { TransformOptions } from '@babel/core';

const extend = (babelConfig: TransformOptions) => ({
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables a cache directory for faster-rebuilds
  cacheDirectory: resolvePathInStorybookCache('babel'),
  ...babelConfig,
});

export const babel = extend;
export const managerBabel = extend;
