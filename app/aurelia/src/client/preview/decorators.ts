import { PartialStoryFn } from '@storybook/addons';
import { IRegistry, IContainer } from 'aurelia';
import { StoryFnAureliaReturnType } from './types';

export const addRegistries = (...items: IRegistry[]) => (
  storyFn: PartialStoryFn<StoryFnAureliaReturnType>
) => {
  const story = storyFn();
  story.items = story.items || [];
  story.items.push(...items);

  return {
    ...story,
    items,
  };
};

export interface Component {
  item?: unknown;
  aliases?: string[];
}

export const addComponents = (...components: Component[] | unknown[]) => (
  storyFn: PartialStoryFn<StoryFnAureliaReturnType>
) => {
  const story = storyFn();
  story.components = story.components || [];
  story.components.push(...components);

  return {
    ...story,
    components,
  };
};

export const addContainer = (container: IContainer) => (
  storyFn: PartialStoryFn<StoryFnAureliaReturnType>
) => {
  const story = storyFn();

  return {
    ...story,
    container,
  };
};
