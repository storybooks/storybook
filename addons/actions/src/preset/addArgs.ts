import mapValues from 'lodash/mapValues';
import { StoryArgTypesEnhancer } from '@storybook/client-api';

import { action } from '../index';

// interface ActionsParameter {
//   disable?: boolean;
//   argTypesRegex?: RegExp;
// }

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */
export const inferActionsFromArgTypesRegex: StoryArgTypesEnhancer = (context) => {
  const { actions, argTypes } = context.parameters;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes) {
    return argTypes;
  }

  const argTypesRegex = new RegExp(actions.argTypesRegex);
  return mapValues(argTypes, (argType, name) => {
    if (!argTypesRegex.test(name)) {
      return argType;
    }
    return { ...argType, defaultValue: argType.defaultValue || action(name) };
  });
};

/**
 * Add action args for list of strings.
 */
export const addActionsFromArgTypes: StoryArgTypesEnhancer = (context) => {
  const { argTypes, actions } = context.parameters;
  if (actions?.disable || !argTypes) {
    return argTypes;
  }

  return mapValues(argTypes, (argType, name) => {
    if (!argType.action) {
      return argType;
    }
    const message = typeof argType.action === 'string' ? argType.action : name;
    return { ...argType, defaultValue: argType.defaultValue || action(message) };
  });
};

export const argTypesEnhancers = [addActionsFromArgTypes, inferActionsFromArgTypesRegex];
