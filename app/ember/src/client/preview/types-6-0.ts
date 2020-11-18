import { Args as DefaultArgs, Annotations, BaseStory } from '@storybook/addons';
import { StoryFnEmberReturnType } from './types';

export { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

type EmberReturnType<Args = DefaultArgs> = StoryFnEmberReturnType<Args>;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<Args = DefaultArgs> = Annotations<Args, EmberReturnType<Args>>;

/**
 * Story function that represents a component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<Args = DefaultArgs> = BaseStory<Args, EmberReturnType<Args>> &
  Annotations<Args, EmberReturnType<Args>>;
