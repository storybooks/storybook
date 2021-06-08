import { IconsProps } from '@storybook/components';
import { ArgType } from '@storybook/api';

export interface ToolbarItem {
  value: string;
  icon?: IconsProps['icon'];
  left?: string;
  right?: string;
  title?: string;
}

export interface NormalizedToolbarConfig {
  icon?: IconsProps['icon'];
  items: ToolbarItem[];
  showName?: boolean;
}

export type NormalizedToolbarArgType = ArgType & {
  toolbar: NormalizedToolbarConfig;
};

export type ToolbarConfig = NormalizedToolbarConfig & {
  items: string[] | ToolbarItem[];
};

export type ToolbarArgType = ArgType & {
  toolbar: ToolbarConfig;
};

export type GlobalTypes = Record<string, ToolbarArgType>;
