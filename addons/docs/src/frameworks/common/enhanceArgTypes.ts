import { ArgTypesEnhancer, combineParameters } from '@storybook/client-api';
import { ArgTypes } from '@storybook/api';
import { normalizeArgTypes } from './normalizeArgTypes';

export const enhanceArgTypes: ArgTypesEnhancer = (context) => {
  const { component, argTypes: userArgTypes = {}, docs = {} } = context.parameters;
  const { extractArgTypes } = docs;

  const normalizedArgTypes = normalizeArgTypes(userArgTypes);
  const namedArgTypes = Object.entries(normalizedArgTypes).reduce<ArgTypes>((acc, [key, val]) => {
    acc[key] = { name: key, ...val };
    return acc;
  }, {});
  const extractedArgTypes = extractArgTypes && component ? extractArgTypes(component) : {};
  const withExtractedTypes = extractedArgTypes
    ? combineParameters(extractedArgTypes, namedArgTypes)
    : namedArgTypes;

  return withExtractedTypes;
};
