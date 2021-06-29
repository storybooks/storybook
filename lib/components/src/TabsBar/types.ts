import type { ReactNode } from 'react';
import type { IconsProps } from '../icon/icon';

export type TabType = 'content' | 'button' | 'menu' | 'seperator' | 'tool';

export type TabIconPosition = 'left' | 'right';

export type TabMenu = {
  id: string;
  Icon?: ReactNode;
  center?: ReactNode;
  highlighted?: boolean;
  icon?: IconsProps['icon'];
  iconPosition?: TabIconPosition;
  label?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  selected?: boolean;
};

export type TabProps = {
  id: string;
  Icon?: ReactNode;
  textColor?: string;
  active?: boolean;
  activeColor?: string;
  content?: ReactNode;
  icon?: IconsProps['icon'];
  label?: ReactNode;
  menu?: TabMenu[];
  narrow?: boolean;
  selected?: string;
  initial?: string;
  type?: TabType;
};

export type TabPropKey = keyof TabProps;
