import { ConcreteComponent } from 'vue';

export type { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnVueReturnType = ConcreteComponent<any>;

export interface IStorybookStory {
  name: string;
  render: ((context: any) => any) | ((args: any, context: any) => any);
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
