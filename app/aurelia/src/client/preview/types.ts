import { PartialStoryFn } from '@storybook/addons';
import { IRegistry, IContainer, Constructable } from 'aurelia';
import { Component } from './decorators';

export interface RenderMainArgs {
  storyFn: PartialStoryFn<Partial<StoryFnAureliaReturnType>>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  showException: (...args: any[]) => void;
  forceRender: boolean;
}
export interface StoryFnAureliaReturnType {
  customElement: Constructable;
  components: Component[] | unknown[];
  template: unknown;
  items: IRegistry[];
  container: IContainer;
  state: any;
}
export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface IStorybookStory {
  name: string;
  render: ((context: any) => any) | ((args: any, context: any) => any);
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
