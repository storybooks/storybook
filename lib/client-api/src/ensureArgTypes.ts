import { ArgTypes } from '@storybook/addons';
import { ArgTypesEnhancer } from './types';
import { combineParameters } from './parameters';

export const ensureArgTypes: ArgTypesEnhancer = (context) => {
  const { argTypes: userArgTypes = {}, args = {} } = context.parameters;
  if (!args) return userArgTypes;
  const argTypes = Object.keys(args).reduce<ArgTypes>((acc, name) => {
    acc[name] = { name };
    return acc;
  }, {});
  return combineParameters(argTypes, userArgTypes);
};
