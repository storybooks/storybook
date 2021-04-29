import React, { FC, useContext } from 'react';
import {
  Source as PureSource,
  SourceError,
  SourceProps as PureSourceProps,
} from '@storybook/components';
import { StoryId } from '@storybook/api';
import { logger } from '@storybook/client-logger';
import { StoryContext } from '@storybook/addons';

import { DocsContext, DocsContextProps } from './DocsContext';
import { SourceContext, SourceContextProps } from './SourceContainer';
import { CURRENT_SELECTION } from './types';
import { SourceType } from '../shared';

import { enhanceSource } from './enhanceSource';

interface CommonProps {
  language?: string;
  dark?: boolean;
  code?: string;
  prismTheme?: any;
}

type SingleSourceProps = {
  id: string;
} & CommonProps;

type MultiSourceProps = {
  ids: string[];
} & CommonProps;

type CodeProps = {
  code: string;
} & CommonProps;

type NoneProps = CommonProps;

type SourceProps = SingleSourceProps | MultiSourceProps | CodeProps | NoneProps;

const getStoryContext = (storyId: StoryId, docsContext: DocsContextProps): StoryContext | null => {
  const { storyStore } = docsContext;
  const storyContext = storyStore?.fromId(storyId);

  if (!storyContext) {
    // Fallback if we can't get the story data for this story
    logger.warn(`Unable to find information for story ID '${storyId}'`);
    return null;
  }

  return storyContext;
};

const getStorySource = (storyId: StoryId, sourceContext: SourceContextProps): string => {
  const { sources } = sourceContext;
  // source rendering is async so source is unavailable at the start of the render cycle,
  // so we fail gracefully here without warning
  return sources?.[storyId] || '';
};

const getSnippet = (snippet: string, storyContext?: StoryContext): string => {
  if (!storyContext) {
    return snippet;
  }

  const { parameters } = storyContext;
  // eslint-disable-next-line no-underscore-dangle
  const isArgsStory = parameters.__isArgsStory;
  const type = parameters.docs?.source?.type || SourceType.AUTO;

  // if user has hard-coded the snippet, that takes precedence
  const userCode = parameters.docs?.source?.code;
  if (userCode) {
    return userCode;
  }

  // if user has explicitly set this as dynamic, use snippet
  if (type === SourceType.DYNAMIC) {
    return parameters.docs?.transformSource?.(snippet, storyContext) || snippet;
  }

  // if this is an args story and there's a snippet
  if (type === SourceType.AUTO && snippet && isArgsStory) {
    return parameters.docs?.transformSource?.(snippet, storyContext) || snippet;
  }

  // otherwise, use the source code logic
  const enhanced = enhanceSource(storyContext) || parameters;
  return enhanced?.docs?.source?.code || '';
};

export const getSourceProps = (
  props: SourceProps,
  docsContext: DocsContextProps,
  sourceContext: SourceContextProps
): PureSourceProps => {
  const { id: currentId } = docsContext;

  const codeProps = props as CodeProps;
  const singleProps = props as SingleSourceProps;
  const multiProps = props as MultiSourceProps;

  const targetId =
    singleProps.id === CURRENT_SELECTION || !singleProps.id ? currentId : singleProps.id;
  const targetIds = multiProps.ids || [targetId];

  const { parameters } = getStoryContext(targetIds[0], docsContext);

  let source = codeProps.code; // prefer user-specified code
  if (!source) {
    source = targetIds
      .map((storyId) => {
        const storySource = getStorySource(storyId, sourceContext);
        const storyContext = getStoryContext(storyId, docsContext);
        return getSnippet(storySource, storyContext);
      })
      .join('\n\n');
  }

  const language = props.language || parameters.docs?.source?.language || 'jsx';
  const prismTheme = props.prismTheme || parameters.docs?.source?.prismTheme;
  const dark = props.dark || parameters.docs?.source?.dark || false;

  return source
    ? {
        code: source,
        language,
        dark,
        prismTheme,
      }
    : { error: SourceError.SOURCE_UNAVAILABLE };
};

/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
export const Source: FC<SourceProps> = (props) => {
  const sourceContext = useContext(SourceContext);
  const docsContext = useContext(DocsContext);
  const sourceProps = getSourceProps(props, docsContext, sourceContext);
  return <PureSource {...sourceProps} />;
};
