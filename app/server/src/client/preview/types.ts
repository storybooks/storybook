import { StoryContext } from '@storybook/addons';

export type { RenderContext } from '@storybook/core';

export type StoryFnServerReturnType = any;

export type FetchStoryHtmlType = (
  url: string,
  id: string,
  params: any,
  context: StoryContext
) => Promise<string | Node>;

export interface IStorybookStory {
  name: string;
  render: ((context: any) => any) | ((args: any, context: any) => any);
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}
