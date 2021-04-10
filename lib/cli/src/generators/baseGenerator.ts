import { NpmOptions } from '../NpmOptions';
import { StoryFormat, SupportedLanguage, SupportedFrameworks, Builder } from '../project_types';
import { getBabelDependencies, copyComponents } from '../helpers';
import { configure } from './configure';
import { getPackageDetails, JsPackageManager } from '../js-package-manager';

export type GeneratorOptions = {
  language: SupportedLanguage;
  storyFormat: StoryFormat;
  builder: Builder;
};

export interface FrameworkOptions {
  extraPackages?: string[];
  extraAddons?: string[];
  staticDir?: string;
  addScripts?: boolean;
  addComponents?: boolean;
  addBabel?: boolean;
  addESLint?: boolean;
  extraMain?: any;
  extensions?: string[];
  commonJs?: boolean;
  /** directly copy the framework folder as-is */
  rawCopy?: boolean;
}

export type Generator = (
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  options: GeneratorOptions
) => Promise<void>;

const defaultOptions: FrameworkOptions = {
  extraPackages: [],
  extraAddons: [],
  staticDir: undefined,
  addScripts: true,
  addComponents: true,
  addBabel: true,
  addESLint: false,
  extraMain: undefined,
  extensions: undefined,
  commonJs: false,
  rawCopy: false,
};

export async function baseGenerator(
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  { language, builder }: GeneratorOptions,
  framework: SupportedFrameworks,
  options: FrameworkOptions = defaultOptions
) {
  const {
    extraAddons,
    extraPackages,
    staticDir,
    addScripts,
    addComponents,
    addBabel,
    addESLint,
    extraMain,
    extensions,
    rawCopy
  } = {
    ...defaultOptions,
    ...options,
  };

  // added to main.js
  // make sure to update `canUsePrebuiltManager` in dev-server.js and build-manager-config/main.js when this list changes
  const addons = ['@storybook/addon-links', '@storybook/addon-essentials'];
  // added to package.json
  const addonPackages = [...addons, '@storybook/addon-actions'];

  const yarn2Dependencies =
    packageManager.type === 'yarn2' ? ['@storybook/addon-docs', '@mdx-js/react'] : [];

  const builderDependencies: Partial<Record<Builder, string>> = {
    [Builder.Webpack5]: '@storybook/builder-webpack5',
  };

  const packageJson = packageManager.retrievePackageJson();
  const installedDependencies = new Set(Object.keys(packageJson.dependencies));

  const packages = [
    `@storybook/${framework}`,
    ...addonPackages,
    ...extraPackages,
    ...extraAddons,
    ...yarn2Dependencies,
    builderDependencies[builder],
  ]
    .filter(Boolean)
    .filter(
      (packageToInstall) => !installedDependencies.has(getPackageDetails(packageToInstall)[0])
    );

  const versionedPackages = await packageManager.getVersionedPackages(...packages);

  const mainOptions =
    builder !== Builder.Webpack4
      ? {
          core: {
            builder,
          },
          ...extraMain,
        }
      : extraMain;
  configure(framework, {
    addons: [...addons, ...extraAddons],
    extensions,
    commonJs: options.commonJs,
    ...mainOptions,
  });
  if (addComponents) {
    copyComponents(framework, language, rawCopy);
  }

  const babelDependencies = addBabel ? await getBabelDependencies(packageManager, packageJson) : [];
  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);

  if (addScripts) {
    packageManager.addStorybookCommandInScripts({
      port: 6006,
      staticFolder: staticDir,
    });
  }

  if (addESLint) {
    packageManager.addESLintConfig();
  }
}
