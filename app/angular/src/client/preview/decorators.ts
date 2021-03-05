/* eslint-disable no-param-reassign */
import { Component, Type } from '@angular/core';
import { DecoratorFunction, StoryContext } from '@storybook/addons';
import { computesTemplateFromComponent } from './angular-beta/ComputesTemplateFromComponent';
import { isComponent } from './angular-beta/utils/NgComponentAnalyzer';
import { ICollection, NgModuleMetadata, StoryFnAngularReturnType } from './types';

export const moduleMetadata = (
  metadata: Partial<NgModuleMetadata>
): DecoratorFunction<StoryFnAngularReturnType> => (storyFn) => {
  const story = storyFn();
  const storyMetadata = story.moduleMetadata || {};
  metadata = metadata || {};

  return {
    ...story,
    moduleMetadata: {
      declarations: [...(metadata.declarations || []), ...(storyMetadata.declarations || [])],
      entryComponents: [
        ...(metadata.entryComponents || []),
        ...(storyMetadata.entryComponents || []),
      ],
      imports: [...(metadata.imports || []), ...(storyMetadata.imports || [])],
      schemas: [...(metadata.schemas || []), ...(storyMetadata.schemas || [])],
      providers: [...(metadata.providers || []), ...(storyMetadata.providers || [])],
    },
  };
};

export const componentMetadata = (
  metadata: Partial<Component>
): DecoratorFunction<StoryFnAngularReturnType> => (storyFn) => {
  return { ...storyFn(), componentMetadata: metadata };
};

export const componentWrapperDecorator = (
  element: Type<unknown> | ((story: string) => string),
  props?: ICollection | ((storyContext: StoryContext) => ICollection)
): DecoratorFunction<StoryFnAngularReturnType> => (storyFn, storyContext) => {
  const story = storyFn();
  const currentProps = typeof props === 'function' ? (props(storyContext) as ICollection) : props;

  const template = isComponent(element)
    ? computesTemplateFromComponent(element, currentProps ?? {}, story.template)
    : element(story.template);

  return {
    ...story,
    template,
    ...(currentProps || story.props
      ? {
          props: {
            ...currentProps,
            ...story.props,
          },
        }
      : {}),
  };
};
