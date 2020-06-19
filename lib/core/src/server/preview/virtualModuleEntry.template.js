/* eslint-disable import/no-unresolved */
import {
  addDecorator,
  addParameters,
  addComponentArgTypesEnhancer,
  addStoryArgTypesEnhancer,
} from '{{clientApi}}';
import { logger } from '{{clientLogger}}';
import {
  decorators,
  parameters,
  componentArgTypesEnhancers,
  storyArgTypesEnhancers,
  globalArgs,
  globalArgTypes,
  args,
  argTypes,
} from '{{configFilename}}';

if (args || argTypes) {
  logger.warn('Invalid args/argTypes in config, ignoring.', JSON.stringify({ args, argTypes }));
}
if (decorators) {
  decorators.forEach((decorator) => addDecorator(decorator));
}
if (parameters || globalArgs || globalArgTypes) {
  addParameters({ ...parameters, globalArgs, globalArgTypes });
}
if (componentArgTypesEnhancers) {
  componentArgTypesEnhancers.forEach((enhancer) => addComponentArgTypesEnhancer(enhancer));
}
if (storyArgTypesEnhancers) {
  storyArgTypesEnhancers.forEach((enhancer) => addStoryArgTypesEnhancer(enhancer));
}
