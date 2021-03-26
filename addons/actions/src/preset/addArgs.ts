import { ArgTypesEnhancer } from '@storybook/client-api';
import { ArgTypes } from '@storybook/addons';

import { action } from '../index';

// interface ActionsParameter {
//   disable?: boolean;
//   argTypesRegex?: RegExp;
// }

/**
 * Automatically add action args for argTypes whose name
 * matches a regex, such as `^on.*` for react-style `onClick` etc.
 */
export const inferActionsFromArgTypesRegex: ArgTypesEnhancer = (context) => {
  const { actions, argTypes } = context.parameters;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes) {
    return argTypes;
  }

  const argTypesRegex = new RegExp(actions.argTypesRegex);
  return Object.entries<ArgTypes>(argTypes).reduce<ArgTypes>((acc, [name, argType]) => {
    if (argTypesRegex.test(name)) {
      acc[name] = { ...argType, defaultValue: action(name) };
    } else {
      acc[name] = argType;
    }

    return acc;
  }, {});
};

/**
 * Add action args for list of strings.
 */
export const addActionsFromArgTypes: ArgTypesEnhancer = (context) => {
  const { argTypes, actions } = context.parameters;
  if (actions?.disable || !argTypes) {
    return argTypes;
  }

  return Object.entries<ArgTypes>(argTypes).reduce<ArgTypes>((acc, [name, argType]) => {
    if (argType.action) {
      const message = typeof argType.action === 'string' ? argType.action : name;
      acc[name] = { ...argType, defaultValue: action(message) };
    } else {
      acc[name] = argType;
    }

    return acc;
  }, {});
};

export const argTypesEnhancers = [addActionsFromArgTypes, inferActionsFromArgTypesRegex];
