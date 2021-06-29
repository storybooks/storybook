import { logger } from '@storybook/client-logger';
import { storyNameFromExport, toId } from '@storybook/csf';
import root from '@storybook/global-root';
import dedent from 'ts-dedent';
import deprecate from 'util-deprecate';

const { FEATURES = {} } = root;

const deprecatedStoryAnnotation = dedent`
CSF .story annotations deprecated; annotate story functions directly:
- StoryFn.story.name => StoryFn.storyName
- StoryFn.story.(parameters|decorators) => StoryFn.(parameters|decorators)
See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations for details and codemod.
`;

const deprecatedStoryAnnotationWarning = deprecate(() => {}, deprecatedStoryAnnotation);

/**
 * Utilities for normalizing a story to support different
 */
export const normalizeV2 = (key: string, storyExport: any, meta: any, globalRender: any) => {
  const exportType = typeof storyExport;
  if (exportType !== 'function') {
    logger.info(`Unexpected story export "${key}": expected function, received "${exportType}".`);
  }

  const storyFn = storyExport;
  const { story } = storyFn;
  const { storyName = story?.name } = storyFn;

  // storyFn.x and storyFn.story.x get merged with
  // storyFn.x taking precedence in the merge
  const storyParams = { ...story?.parameters, ...storyFn.parameters };
  const decorators = [...(storyFn.decorators || []), ...(story?.decorators || [])];
  const loaders = [...(storyFn.loaders || []), ...(story?.loaders || [])];
  const args = { ...story?.args, ...storyFn.args };
  const argTypes = { ...story?.argTypes, ...storyFn.argTypes };

  if (story) {
    logger.debug('deprecated story', story);
    deprecatedStoryAnnotationWarning();
  }

  const exportName = storyNameFromExport(key);
  const parameters = {
    ...storyParams,
    __id: toId(meta.id || meta.title, exportName),
    decorators,
    loaders,
    args,
    argTypes,
  };

  return {
    name: storyName || exportName,
    storyFn,
    parameters,
  };
};

export const normalizeV3 = (key: string, storyExport: any, meta: any, globalRender: any) => {
  let storyObject = storyExport;
  if (typeof storyExport === 'function') {
    storyObject = { ...storyExport };
    storyObject.render = storyExport;
  }

  if (storyObject.story) {
    throw new Error(deprecatedStoryAnnotation);
  }

  const {
    render,
    play,
    parameters: storyParams,
    decorators = [],
    loaders = [],
    args = {},
    argTypes = {},
  } = storyObject;

  const storyFn = render || meta.render || globalRender;
  const exportName = storyNameFromExport(key);

  const parameters = {
    ...storyParams,
    __id: toId(meta.id || meta.title, exportName),
    decorators,
    loaders,
    args,
    argTypes,
    play: play || meta.play,
  };

  return {
    name: storyObject.name || storyObject.storyName || exportName,
    storyFn,
    parameters,
  };
};

export const normalizeStory = FEATURES.previewCsfV3 ? normalizeV3 : normalizeV2;
