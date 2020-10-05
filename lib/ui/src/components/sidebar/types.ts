import { StoriesHash, State } from '@storybook/api';
import { ControllerStateAndHelpers } from 'downshift';

export type Refs = State['refs'];
export type RefType = Refs[keyof Refs];
export type Item = StoriesHash[keyof StoriesHash];
export type Dataset = Record<string, Item>;

export interface CombinedDataset {
  hash: Refs;
  entries: [string, RefType][];
}

export interface StoryRef {
  storyId: string;
  refId: string;
}

export type Selection = StoryRef | null;

export interface Match {
  value: string;
  indices: [number, number][];
  key: 'name' | 'path';
  arrayIndex: number;
}

export function isSearchResult(x: any): x is SearchResult {
  return !!x.item;
}
export function isExpandType(x: any): x is ExpandType {
  return !!x.totalCount;
}

export interface ExpandType {
  showAll: () => void;
  totalCount: number;
}

export type SearchItem = Item & { refId: string; path: string[] };

export type SearchResult = Fuse.FuseResultWithMatches<SearchItem> &
  Fuse.FuseResultWithScore<SearchItem>;

export type DownshiftItem = SearchResult | ExpandType;

export type SearchChildrenFn = (args: {
  inputValue: string;
  results: DownshiftItem[];
  inputHasFocus: boolean;
  getMenuProps: ControllerStateAndHelpers<DownshiftItem>['getMenuProps'];
  getItemProps: ControllerStateAndHelpers<DownshiftItem>['getItemProps'];
  highlightedIndex: number | null;
}) => React.ReactNode;