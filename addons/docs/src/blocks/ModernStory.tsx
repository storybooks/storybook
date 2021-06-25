import React, { FunctionComponent, ReactNode, ElementType, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { resetComponents } from '@storybook/components';
import { DOCS_TARGETTED_RENDER, DOCS_TARGETTED_DESTROY } from '@storybook/core-events';
import { toId, storyNameFromExport } from '@storybook/csf';
import { Args, BaseAnnotations, addons } from '@storybook/addons';
import { CURRENT_SELECTION } from './types';

import { DocsContext, DocsContextProps } from './DocsContext';

export const storyBlockIdFromId = (storyId: string) => `story--${storyId}`;

type CommonProps = BaseAnnotations<Args, any> & {
  height?: string;
  inline?: boolean;
};

type StoryDefProps = {
  name: string;
  children: ReactNode;
};

type StoryRefProps = {
  id?: string;
};

type StoryImportProps = {
  name: string;
  story: ElementType;
};

export type StoryProps = (StoryDefProps | StoryRefProps | StoryImportProps) & CommonProps;

export const lookupStoryId = (
  storyName: string,
  { mdxStoryNameToKey, mdxComponentMeta }: DocsContextProps
) =>
  toId(
    mdxComponentMeta.id || mdxComponentMeta.title,
    storyNameFromExport(mdxStoryNameToKey[storyName])
  );

const Placeholder: FunctionComponent<any> = ({ id, name }) => {
  const channel = addons.getChannel();
  const identifier = storyBlockIdFromId(id);
  useEffect(() => {
    channel.emit(DOCS_TARGETTED_RENDER, { identifier, id, name });
    return () => {
      channel.emit(DOCS_TARGETTED_DESTROY, { identifier, id, name });
      // TODO this does nothing, should it do something though?
    };
  });

  return (
    <div id={identifier} data-name={name}>
      <span data-is-loadering-indicator="true">loading story...</span>
    </div>
  );
};

const Story: FunctionComponent<StoryProps> = (props) => (
  <DocsContext.Consumer>
    {(context) => {
      const { id } = props as StoryRefProps;
      const { name } = props as StoryDefProps;
      const inputId = id === CURRENT_SELECTION ? context.id : id;
      const previewId = inputId || lookupStoryId(name, context);

      return (
        <MDXProvider components={resetComponents}>
          <Placeholder id={previewId} name={name} />
        </MDXProvider>
      );
    }}
  </DocsContext.Consumer>
);

Story.defaultProps = {
  children: null,
  name: null,
};

export { Story };
