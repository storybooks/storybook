/**
 * This file is to be watched !
 * The code must be compatible from @angular-devkit version 6.1.0 to the latest supported
 *
 * It uses code block of angular cli to extract parts of webpack configuration
 */

import path from 'path';
import webpack from 'webpack';
import { normalize, resolve, workspaces, getSystemPath } from '@angular-devkit/core';
import { createConsoleLogger } from '@angular-devkit/core/node';

// Only type, so not dependent on the client version
import {
  WebpackConfigOptions,
  BuildOptions,
} from '@angular-devkit/build-angular/src/utils/build-options';

import { moduleIsAvailable } from './utils/module-is-available';
import { normalizeAssetPatterns } from './utils/normalize-asset-patterns';
import { normalizeOptimization } from './utils/normalize-optimization';

const importAngularCliWebpackConfigGenerator = (): {
  getCommonConfig: (config: unknown) => webpack.Configuration;
  getStylesConfig: (config: unknown) => webpack.Configuration;
} => {
  let angularWebpackConfig;

  // First we look for webpack config according to directory structure of Angular 11
  if (moduleIsAvailable('@angular-devkit/build-angular/src/webpack/configs')) {
    // eslint-disable-next-line global-require
    angularWebpackConfig = require('@angular-devkit/build-angular/src/webpack/configs');
  }
  // We fallback on directory structure of Angular 10 (and below)
  else if (
    moduleIsAvailable('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs')
  ) {
    // eslint-disable-next-line global-require
    angularWebpackConfig = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs');
  } else {
    throw new Error('Webpack config not found in "@angular-devkit/build-angular"');
  }

  return {
    getCommonConfig: angularWebpackConfig.getCommonConfig,
    getStylesConfig: angularWebpackConfig.getStylesConfig,
  };
};

const importAngularCliReadTsconfigUtil = (): typeof import('@angular-devkit/build-angular/src/utils/read-tsconfig') => {
  // First we look for webpack config according to directory structure of Angular 11
  if (moduleIsAvailable('@angular-devkit/build-angular/src/utils/read-tsconfig')) {
    // eslint-disable-next-line global-require
    return require('@angular-devkit/build-angular/src/utils/read-tsconfig');
  }
  // We fallback on directory structure of Angular 10 (and below)
  if (
    moduleIsAvailable('@angular-devkit/build-angular/src/angular-cli-files/utilities/read-tsconfig')
  ) {
    // eslint-disable-next-line global-require
    return require('@angular-devkit/build-angular/src/angular-cli-files/utilities/read-tsconfig');
  }
  throw new Error('ReadTsconfig not found in "@angular-devkit/build-angular"');
};

const buildWebpackConfigOptions = async (
  dirToSearch: string,
  project: workspaces.ProjectDefinition,
  target: workspaces.TargetDefinition
): Promise<WebpackConfigOptions> => {
  const { options: projectBuildOptions = {} } = target;

  const requiredOptions = ['tsConfig', 'assets', 'optimization'];

  if (!requiredOptions.every((key) => key in projectBuildOptions)) {
    throw new Error(
      `Missing required options in project target. Check "${requiredOptions.join(', ')}"`
    );
  }

  const workspaceRootNormalized = normalize(dirToSearch);
  const projectRootNormalized = resolve(
    workspaceRootNormalized,
    normalize((project.root as string) || '')
  );
  const sourceRootNormalized = project.sourceRoot
    ? resolve(workspaceRootNormalized, normalize(project.sourceRoot))
    : undefined;

  const tsConfigPath = path.resolve(
    getSystemPath(workspaceRootNormalized),
    projectBuildOptions.tsConfig as string
  );
  const tsConfig = importAngularCliReadTsconfigUtil().readTsconfig(tsConfigPath);

  const ts = await import('typescript');
  const scriptTarget = tsConfig.options.target || ts.ScriptTarget.ES5;

  const buildOptions: BuildOptions = {
    // Default options
    budgets: [],
    fileReplacements: [],
    main: '',
    outputPath: 'dist/storybook-angular',
    scripts: [],
    sourceMap: {},
    styles: [],
    // Deleted in angular 12. Keep for compatibility with versions lower than angular 12
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    lazyModules: [],

    // Project Options
    ...projectBuildOptions,
    assets: normalizeAssetPatterns(
      (projectBuildOptions.assets as any[]) || [],
      workspaceRootNormalized,
      projectRootNormalized,
      sourceRootNormalized
    ),
    optimization: normalizeOptimization(projectBuildOptions.optimization as any),

    // Forced options
    statsJson: false,

    // Deleted in angular 12. Keep for compatibility with versions lower than angular 12
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    forkTypeChecker: false,
  };

  return {
    root: getSystemPath(workspaceRootNormalized),
    // The dependency of `@angular-devkit/build-angular` to `@angular-devkit/core` is not exactly the same version as the one for storybook (node modules of node modules ^^)
    logger: (createConsoleLogger() as unknown) as WebpackConfigOptions['logger'],
    projectRoot: getSystemPath(projectRootNormalized),
    sourceRoot: getSystemPath(sourceRootNormalized),
    buildOptions,
    tsConfig,
    tsConfigPath,
    scriptTarget,
  };
};

export type AngularCliWebpackConfig = {
  cliCommonWebpackConfig: {
    plugins: webpack.Plugin[];
    resolve: {
      modules: string[];
    };
    resolveLoader: webpack.ResolveLoader;
  };
  cliStyleWebpackConfig: {
    entry: string | string[] | webpack.Entry | webpack.EntryFunc;
    module: {
      rules: webpack.RuleSetRule[];
    };
    plugins: webpack.Plugin[];
  };
  tsConfigPath: string;
};

/**
 * Uses angular cli to extract webpack configuration.
 * The `AngularCliWebpackConfig` type lists the parts used by storybook
 */
export async function extractAngularCliWebpackConfig(
  dirToSearch: string,
  project: workspaces.ProjectDefinition,
  target: workspaces.TargetDefinition
): Promise<AngularCliWebpackConfig> {
  const { getCommonConfig, getStylesConfig } = importAngularCliWebpackConfigGenerator();

  const webpackConfigOptions = await buildWebpackConfigOptions(dirToSearch, project, target);

  const cliCommonConfig = getCommonConfig(webpackConfigOptions);
  const cliStyleConfig = getStylesConfig(webpackConfigOptions);

  return {
    cliCommonWebpackConfig: {
      plugins: cliCommonConfig.plugins,
      resolve: {
        modules: cliCommonConfig.resolve?.modules,
      },
      resolveLoader: cliCommonConfig.resolveLoader,
    },
    cliStyleWebpackConfig: {
      entry: cliStyleConfig.entry,
      module: {
        rules: [...cliStyleConfig.module.rules],
      },
      plugins: cliStyleConfig.plugins,
    },
    tsConfigPath: webpackConfigOptions.tsConfigPath,
  };
}
