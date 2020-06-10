import React, { FunctionComponent } from 'react';
import { Source, SourceProps as PureSourceProps, SourceError } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { CURRENT_SELECTION } from './types';
import { enhanceSource } from './enhanceSource';

type CommonProps = Pick<PureSourceProps, 'language' | 'dark' | 'format'>;

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

export const getSourceProps = (
  props: SourceProps,
  { id: currentId, storyStore }: DocsContextProps
): PureSourceProps => {
  const codeProps = props as CodeProps;
  const singleProps = props as SingleSourceProps;
  const multiProps = props as MultiSourceProps;

  let source = codeProps.code; // prefer user-specified code
  if (!source) {
    const targetId =
      singleProps.id === CURRENT_SELECTION || !singleProps.id ? currentId : singleProps.id;
    const targetIds = multiProps.ids || [targetId];
    source = targetIds
      .map((sourceId) => {
        const data = storyStore.fromId(sourceId);
        const enhanced = data && (enhanceSource(data) || data.parameters);
        return enhanced?.docs?.source?.code || '';
      })
      .join('\n\n');
  }

  return source
    ? {
        format: props.format ?? true,
        dark: props.dark ?? false,
        language: props.language ?? 'jsx',
        code: source,
      }
    : { error: SourceError.SOURCE_UNAVAILABLE };
};

/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
const SourceContainer: FunctionComponent<SourceProps> = (props) => (
  <DocsContext.Consumer>
    {(context) => {
      const sourceProps = getSourceProps(props, context);
      return <Source {...sourceProps} />;
    }}
  </DocsContext.Consumer>
);

export { SourceContainer as Source };
