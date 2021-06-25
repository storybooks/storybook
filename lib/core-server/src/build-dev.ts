import { logger, instance as npmLog } from '@storybook/node-logger';
import {
  CLIOptions,
  LoadOptions,
  BuilderOptions,
  resolvePathInStorybookCache,
  loadAllPresets,
  Options,
  cache,
  StorybookConfig,
} from '@storybook/core-common';
import dedent from 'ts-dedent';
import prompts from 'prompts';

import path from 'path';
import { storybookDevServer } from './dev-server';
import { getDevCli } from './cli';
import { getReleaseNotesData, getReleaseNotesFailedState } from './utils/release-notes';
import { outputStats } from './utils/output-stats';
import { outputStartupInformation } from './utils/output-startup-information';
import { updateCheck } from './utils/update-check';
import { getServerPort } from './utils/server-address';
import { getPreviewBuilder } from './utils/get-preview-builder';
import { getManagerBuilder } from './utils/get-manager-builder';

export async function buildDevStandalone(options: CLIOptions & LoadOptions & BuilderOptions) {
  const { packageJson, versionUpdates, releaseNotes } = options;
  const { version } = packageJson;

  // updateInfo and releaseNotesData are cached, so this is typically pretty fast
  const [port, versionCheck, releaseNotesData] = await Promise.all([
    getServerPort(options.port),
    versionUpdates
      ? updateCheck(version)
      : Promise.resolve({ success: false, data: {}, time: Date.now() }),
    releaseNotes
      ? getReleaseNotesData(version, cache)
      : Promise.resolve(getReleaseNotesFailedState(version)),
  ]);

  if (!options.ci && !options.smokeTest && options.port != null && port !== options.port) {
    const { shouldChangePort } = await prompts({
      type: 'confirm',
      initial: true,
      name: 'shouldChangePort',
      message: `Port ${options.port} is not available. Would you like to run Storybook on port ${port} instead?`,
    });
    if (!shouldChangePort) process.exit(1);
  }

  /* eslint-disable no-param-reassign */
  options.port = port;
  options.versionCheck = versionCheck;
  options.releaseNotesData = releaseNotesData;
  options.configType = 'DEVELOPMENT';
  options.configDir = path.resolve(options.configDir);
  options.outputDir = options.smokeTest
    ? resolvePathInStorybookCache('public')
    : path.resolve(options.outputDir || resolvePathInStorybookCache('public'));
  /* eslint-enable no-param-reassign */

  const previewBuilder = await getPreviewBuilder(options.configDir);
  const managerBuilder = await getManagerBuilder(options.configDir);

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

  const fullOptions: Options = {
    ...options,
    presets,
    previewCsfV3: features?.previewCsfV3,
    modernInlineRender: features?.modernInlineRender,
  };

  const { address, networkAddress, managerResult, previewResult } = await storybookDevServer(
    fullOptions
  );

  const previewTotalTime = previewResult && previewResult.totalTime;
  const managerTotalTime = managerResult && managerResult.totalTime;

  const previewStats = previewResult && previewResult.stats;
  const managerStats = managerResult && managerResult.stats;

  if (options.webpackStatsJson) {
    const target = options.webpackStatsJson === true ? options.outputDir : options.webpackStatsJson;
    await outputStats(target, previewStats, managerStats);
  }

  if (options.smokeTest) {
    // @ts-ignore
    const managerWarnings = (managerStats && managerStats.toJson().warnings) || [];
    if (managerWarnings.length > 0) logger.warn(`manager: ${managerWarnings}`);
    // I'm a little reticent to import webpack types in this file :shrug:
    // @ts-ignore
    const previewWarnings = (previewStats && previewStats.toJson().warnings) || [];
    if (previewWarnings.length > 0) logger.warn(`preview: ${previewWarnings}`);
    process.exit(
      managerWarnings.length > 0 || (previewWarnings.length > 0 && !options.ignorePreview) ? 1 : 0
    );
    return;
  }

  outputStartupInformation({
    updateInfo: versionCheck,
    version,
    address,
    networkAddress,
    managerTotalTime,
    previewTotalTime,
  });
}

export async function buildDev(loadOptions: LoadOptions) {
  const cliOptions = await getDevCli(loadOptions.packageJson);

  try {
    await buildDevStandalone({
      ...cliOptions,
      ...loadOptions,
      configDir: loadOptions.configDir || cliOptions.configDir || './.storybook',
      configType: 'DEVELOPMENT',
      ignorePreview: !!cliOptions.previewUrl && !cliOptions.forceBuildPreview,
      docsMode: !!cliOptions.docs,
      cache,
    });
  } catch (error) {
    // this is a weird bugfix, somehow 'node-pre-gyp' is polluting the npmLog header
    npmLog.heading = '';

    if (error instanceof Error) {
      if ((error as any).error) {
        logger.error((error as any).error);
      } else if ((error as any).stats && (error as any).stats.compilation.errors) {
        (error as any).stats.compilation.errors.forEach((e: any) => logger.plain(e));
      } else {
        logger.error(error as any);
      }
    } else if (error.compilation?.errors) {
      error.compilation.errors.forEach((e: any) => logger.plain(e));
    }

    logger.line();
    logger.warn(
      error.close
        ? dedent`
          FATAL broken build!, will close the process,
          Fix the error below and restart storybook.
        `
        : dedent`
          Broken build, fix the error above.
          You may need to refresh the browser.
        `
    );
    logger.line();

    process.exit(1);
  }
}
