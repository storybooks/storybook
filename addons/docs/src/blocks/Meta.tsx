import React, { FC, useContext } from 'react';
import root from '@storybook/global-root';
import { Args, BaseAnnotations, BaseMeta } from '@storybook/addons';
import { Anchor } from './Anchor';
import { DocsContext, DocsContextProps } from './DocsContext';
import { getDocsStories } from './utils';
import { Component } from './types';

const { document } = root;

type MetaProps = BaseMeta<Component> & BaseAnnotations<Args, any>;

function getFirstStoryId(docsContext: DocsContextProps): string {
  const stories = getDocsStories(docsContext);

  return stories.length > 0 ? stories[0].id : null;
}

function renderAnchor() {
  const context = useContext(DocsContext);
  const anchorId = getFirstStoryId(context) || context.id;

  return <Anchor storyId={anchorId} />;
}

/**
 * This component is used to declare component metadata in docs
 * and gets transformed into a default export underneath the hood.
 */
export const Meta: FC<MetaProps> = () => {
  const params = new URL(document.location.toString()).searchParams;
  const isDocs = params.get('viewMode') === 'docs';

  return isDocs ? renderAnchor() : null;
};
