import { HTMLAttributes } from 'react';
import type { TabProps, TabPropKey } from '../types';

const tabPropKeys: TabPropKey[] = [
  'id',
  'Icon',
  'textColor',
  'active',
  'activeColor',
  'content',
  'icon',
  'label',
  'menu',
  'narrow',
  'selected',
  'initial',
  'type',
];

export const getTabProps = <T extends HTMLElement = HTMLButtonElement>(
  original: TabProps & HTMLAttributes<T>
) => {
  const tabProps: Record<string, any> = {};

  Object.keys(original).forEach((_key) => {
    const key = _key as keyof TabProps;
    if (tabPropKeys.includes(key)) {
      tabProps[key] = original[key];
    }
  });

  if (original.children && !original.content) {
    tabProps.content = tabProps.children;
  }

  return tabProps as TabProps;
};
