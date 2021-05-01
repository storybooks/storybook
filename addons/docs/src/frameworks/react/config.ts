import { PartialStoryFn } from '@storybook/addons';
import { extractArgTypes } from './extractArgTypes';
import { extractComponentDescription } from '../../lib/docgen';
import { jsxDecorator } from './jsxDecorator';

export const parameters = {
  docs: {
    inlineStories: true,
    // NOTE: that the result is a react element. Hooks support is provided by the outer code.
    prepareForInline: (storyFn: PartialStoryFn) => storyFn(),
    extractArgTypes,
    extractComponentDescription,
  },
};

export const decorators = [jsxDecorator];
