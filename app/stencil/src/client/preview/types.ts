export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';
export type { RenderContext } from '@storybook/core';

export type StoryFnHtmlReturnType = string | Node;

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}
