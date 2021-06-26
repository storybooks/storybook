import global from 'global';
import React, { FunctionComponent, useMemo } from 'react';

import { styled } from '@storybook/theming';
import { Spaced, ScrollArea } from '@storybook/components';
import type { StoriesHash, State } from '@storybook/api';

import { Heading } from './Heading';

import { DEFAULT_REF_ID, collapseAllStories, collapseDocsOnlyStories } from './data';
import { Explorer } from './Explorer';
import { Search } from './Search';
import { SearchResults } from './SearchResults';
import { Refs, CombinedDataset, Selection } from './types';
import { useLastViewed } from './useLastViewed';

const { DOCS_MODE } = global;

const StyledSpaced = styled(Spaced)({
  padding: '20px 20px 2.5rem 20px',
});

const Swap = React.memo<{ children: React.ReactNode; condition: boolean }>(
  ({ children, condition }) => {
    const [a, b] = React.Children.toArray(children);
    return (
      <>
        <div style={{ display: condition ? 'block' : 'none' }}>{a}</div>
        <div style={{ display: condition ? 'none' : 'block' }}>{b}</div>
      </>
    );
  }
);

const useCombination = (
  stories: StoriesHash,
  ready: boolean,
  error: Error | undefined,
  refs: Refs
): CombinedDataset => {
  const hash = useMemo(
    () => ({
      [DEFAULT_REF_ID]: {
        stories,
        title: null,
        id: DEFAULT_REF_ID,
        url: 'iframe.html',
        ready,
        error,
      },
      ...refs,
    }),
    [refs, stories]
  );
  return useMemo(() => ({ hash, entries: Object.entries(hash) }), [hash]);
};

export interface SidebarProps {
  stories: StoriesHash;
  storiesConfigured: boolean;
  storiesFailed?: Error;
  refs: State['refs'];
  menu: any[];
  storyId?: string;
  refId?: string;
  menuHighlighted?: boolean;
  enableShortcuts?: boolean;
}

export const Sidebar: FunctionComponent<SidebarProps> = React.memo(
  ({
    storyId = null,
    refId = DEFAULT_REF_ID,
    stories: storiesHash,
    storiesConfigured,
    storiesFailed,
    menu,
    menuHighlighted = false,
    enableShortcuts = true,
    refs = {},
  }) => {
    const selected: Selection = useMemo(() => storyId && { storyId, refId }, [storyId, refId]);
    const stories = useMemo(
      () => (DOCS_MODE ? collapseAllStories : collapseDocsOnlyStories)(storiesHash),
      [DOCS_MODE, storiesHash]
    );
    const dataset = useCombination(stories, storiesConfigured, storiesFailed, refs);
    const isLoading = !dataset.hash[DEFAULT_REF_ID].ready;
    const lastViewedProps = useLastViewed(selected);

    return (
      <ScrollArea vertical absolute sliderPadding={8} className="container sidebar-container">
        <StyledSpaced row={1.6}>
          <Heading className="sidebar-header" menuHighlighted={menuHighlighted} menu={menu} />

          <Search
            dataset={dataset}
            isLoading={isLoading}
            enableShortcuts={enableShortcuts}
            {...lastViewedProps}
          >
            {({
              query,
              results,
              isBrowsing,
              closeMenu,
              getMenuProps,
              getItemProps,
              highlightedIndex,
            }) => (
              <Swap condition={isBrowsing}>
                <Explorer
                  dataset={dataset}
                  selected={selected}
                  isLoading={isLoading}
                  isBrowsing={isBrowsing}
                />
                <SearchResults
                  query={query}
                  results={results}
                  closeMenu={closeMenu}
                  getMenuProps={getMenuProps}
                  getItemProps={getItemProps}
                  highlightedIndex={highlightedIndex}
                  enableShortcuts={enableShortcuts}
                  isLoading={isLoading}
                />
              </Swap>
            )}
          </Search>
        </StyledSpaced>
      </ScrollArea>
    );
  }
);
