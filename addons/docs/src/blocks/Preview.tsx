import React, { FunctionComponent, ReactElement, ReactNode, ReactNodeArray } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { toId, storyNameFromExport } from '@storybook/csf';
import { resetComponents } from '@storybook/components/html';
import {
  Preview as PurePreview,
  PreviewProps as PurePreviewProps,
  SourceProps as PureSourceProps,
} from '@storybook/components';
import { getSourceProps } from './Source';
import { DocsContext, DocsContextProps } from './DocsContext';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

type PassedSourceProps = Pick<PureSourceProps, 'language' | 'format'>;
interface SourcePropsWithState extends PassedSourceProps {
  state: SourceState;
}
type WithSourceData = SourceState | SourcePropsWithState;

interface PreviewProps extends Omit<PurePreviewProps, 'withSource'> {
  withSource?: WithSourceData;
  mdxSource?: string;
}

const getPreviewProps = (
  {
    withSource = SourceState.CLOSED,
    mdxSource,
    children,
    ...props
  }: PreviewProps & { children?: ReactNode },
  { mdxStoryNameToKey, mdxComponentMeta, storyStore }: DocsContextProps
): PurePreviewProps => {
  const sourceState = typeof withSource === 'object' ? withSource.state : withSource;
  const passedSourceProps: PassedSourceProps = typeof withSource === 'object' ? withSource : {};

  if (sourceState === SourceState.NONE) {
    return { ...props, withSource: passedSourceProps };
  }

  if (mdxSource) {
    return {
      ...props,
      withSource: getSourceProps(
        { ...passedSourceProps, code: decodeURI(mdxSource) },
        { storyStore }
      ),
    };
  }

  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  const stories = childArray.filter(
    (c: ReactElement) => c.props && (c.props.id || c.props.name)
  ) as ReactElement[];
  const targetIds = stories.map(
    (s) =>
      s.props.id ||
      toId(
        mdxComponentMeta.id || mdxComponentMeta.title,
        storyNameFromExport(mdxStoryNameToKey[s.props.name])
      )
  );

  const sourceProps = getSourceProps(
    {
      ...passedSourceProps,
      ids: targetIds,
    },
    { storyStore }
  );
  return {
    ...props, // pass through columns etc.
    withSource: sourceProps,
    isExpanded: sourceState === SourceState.OPEN,
  };
};

export const Preview: FunctionComponent<PreviewProps> = (props) => (
  <DocsContext.Consumer>
    {(context) => {
      const previewProps = getPreviewProps(props, context);
      return (
        <MDXProvider components={resetComponents}>
          <PurePreview {...previewProps}>{props.children}</PurePreview>
        </MDXProvider>
      );
    }}
  </DocsContext.Consumer>
);
