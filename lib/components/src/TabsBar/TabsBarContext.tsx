import { createContext } from 'react';
import { TabProps } from './types';

export type AddToMapFn = (props: TabProps) => void;

export type RemoveFromMapFn = (props: TabProps) => void;

interface TabsBarContextProps {
  addToMap: AddToMapFn;
  removeFromMap: RemoveFromMapFn;
  onSelect: (id: string) => void;
  selectedTabId: string;
}

export const TabsBarContext = createContext<TabsBarContextProps | null>(null);
