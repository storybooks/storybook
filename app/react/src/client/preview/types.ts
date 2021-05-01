import { ReactElement } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
export type { RenderContext } from '@storybook/client-api';
export type { StoryContext } from '@storybook/addons';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = ReactElement<unknown>;

export interface IStorybookStory {
  name: string;
  render: ((context: any) => any) | ((args: any, context: any) => any);
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
