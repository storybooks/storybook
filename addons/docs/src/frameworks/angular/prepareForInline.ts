import React from 'react';
import { IStory, StoryContext } from '@storybook/angular';
import { PartialStoryFn } from '@storybook/addons';
import { logger } from '@storybook/client-logger';

const customElementsVersions: Record<string, number> = {};

/**
 * Uses angular element to generate on-the-fly web components and reference it with `customElements`
 * then it is added into react
 */
export const prepareForInline = (
  storyFn: PartialStoryFn<IStory>,
  { id, parameters }: StoryContext
) => {
  // Upgrade story version in order that the next defined component has a unique key
  customElementsVersions[id] =
    customElementsVersions[id] !== undefined ? customElementsVersions[id] + 1 : 0;

  const customElementsName = `${id}_${customElementsVersions[id]}`;

  const Story = class Story extends React.Component {
    wrapperRef: React.RefObject<unknown>;

    elementName: string;

    constructor(props: any) {
      super(props);
      this.wrapperRef = React.createRef();
    }

    async componentDidMount() {
      const { ElementRendererService } = await import('@storybook/angular/element-renderer').catch(
        (error) => {
          logger.error(
            'Check the documentation to activate `inlineStories`. The `@angular/elements` & `@webcomponents/custom-elements` dependencies are required.'
          );
          throw error;
        }
      );

      // eslint-disable-next-line no-undef
      customElements.define(
        customElementsName,
        await new ElementRendererService().renderAngularElement({
          storyFnAngular: storyFn(),
          parameters,
        })
      );
    }

    render() {
      return React.createElement(customElementsName, {
        ref: this.wrapperRef,
      });
    }
  };
  return React.createElement(Story);
};
