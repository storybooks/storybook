import chalk from 'chalk';
import cpy from 'cpy';
import fs from 'fs-extra';
import path from 'path';

import { logger } from '@storybook/node-logger';

import {
  loadAllPresets,
  LoadOptions,
  CLIOptions,
  BuilderOptions,
  Options,
  Builder,
  StorybookConfig,
  cache,
} from '@storybook/core-common';

import { getProdCli } from './cli';
import { outputStats } from './utils/output-stats';
import { copyAllStaticFiles } from './utils/copy-all-static-files';
import { getPreviewBuilder } from './utils/get-preview-builder';
import { getManagerBuilder } from './utils/get-manager-builder';
import { extractStoriesJson } from './utils/stories-json';

export async function buildStaticStandalone(options: CLIOptions & LoadOptions & BuilderOptions) {
  /* eslint-disable no-param-reassign */
  options.configType = 'PRODUCTION';

  if (options.outputDir === '') {
    throw new Error("Won't remove current directory. Check your outputDir!");
  }

  if (options.staticDir?.includes('/')) {
    throw new Error("Won't copy root directory. Check your staticDirs!");
  }

  options.outputDir = path.isAbsolute(options.outputDir)
    ? options.outputDir
    : path.join(process.cwd(), options.outputDir);
  options.configDir = path.resolve(options.configDir);
  /* eslint-enable no-param-reassign */

  const defaultFavIcon = require.resolve('./public/favicon.ico');

  logger.info(chalk`=> Cleaning outputDir: {cyan ${options.outputDir}}`);
  if (options.outputDir === '/') {
    throw new Error("Won't remove directory '/'. Check your outputDir!");
  }
  await fs.emptyDir(options.outputDir);

  await cpy(defaultFavIcon, options.outputDir);
  await copyAllStaticFiles(options.staticDir, options.outputDir);

  const previewBuilder: Builder<unknown, unknown> = await getPreviewBuilder(options.configDir);
  const managerBuilder: Builder<unknown, unknown> = await getManagerBuilder(options.configDir);

  const presets = loadAllPresets({
    corePresets: [
      require.resolve('./presets/common-preset'),
      ...managerBuilder.corePresets,
      ...previewBuilder.corePresets,
      require.resolve('./presets/babel-cache-preset'),
    ],
    overridePresets: previewBuilder.overridePresets,
    ...options,
  });

  const features = await presets.apply<StorybookConfig['features']>('features');
  if (features?.buildStoriesJson) {
    const storiesGlobs = (await presets.apply('stories')) as StorybookConfig['stories'];
    await extractStoriesJson(
      path.join(options.outputDir, 'stories.json'),
      storiesGlobs,
      options.configDir
    );
  }

  const fullOptions: Options = {
    ...options,
    presets,
    previewCsfV3: features?.previewCsfV3,
    modernInlineRender: features?.modernInlineRender,
  };

  const core = await presets.apply<{ builder?: string }>('core');

  const { getPrebuiltDir } =
    core?.builder === 'webpack5'
      ? await import('@storybook/manager-webpack5/prebuilt-manager')
      : await import('@storybook/manager-webpack4/prebuilt-manager');

  const prebuiltDir = await getPrebuiltDir(fullOptions);

  const startTime = process.hrtime();
  // When using the prebuilt manager, we straight up copy it into the outputDir instead of building it
  const manager = prebuiltDir
    ? cpy('**', options.outputDir, { cwd: prebuiltDir, parents: true }).then(() => {})
    : managerBuilder.build({ startTime, options: fullOptions });

  if (options.ignorePreview) {
    logger.info(`=> Not building preview`);
  }

  const preview = options.ignorePreview
    ? Promise.resolve()
    : previewBuilder.build({
        startTime,
        options: fullOptions,
      });

  const [managerStats, previewStats] = await Promise.all([manager, preview]);

  if (options.webpackStatsJson) {
    const target = options.webpackStatsJson === true ? options.outputDir : options.webpackStatsJson;
    await outputStats(target, previewStats, managerStats);
  }

  logger.info(`=> Output directory: ${options.outputDir}`);
}

export async function buildStatic({ packageJson, ...loadOptions }: LoadOptions) {
  const cliOptions = getProdCli(packageJson);

  try {
    await buildStaticStandalone({
      ...cliOptions,
      ...loadOptions,
      packageJson,
      configDir: loadOptions.configDir || cliOptions.configDir || './.storybook',
      outputDir: loadOptions.outputDir || cliOptions.outputDir || './storybook-static',
      ignorePreview:
        (!!loadOptions.ignorePreview || !!cliOptions.previewUrl) && !cliOptions.forceBuildPreview,
      docsMode: !!cliOptions.docs,
      configType: 'PRODUCTION',
      cache,
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
