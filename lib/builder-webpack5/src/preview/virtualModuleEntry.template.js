/* eslint-disable import/no-unresolved */
import {
  addArgs,
  addArgTypes,
  addDecorator,
  addParameters,
  addLoader,
  addArgTypesEnhancer,
} from '{{clientApi}}';
import { logger } from '{{clientLogger}}';
import * as config from '{{configFilename}}';

Object.keys(config).forEach((key) => {
  const value = config[key];
  switch (key) {
    case 'args': {
      return addArgs(value);
    }
    case 'argTypes': {
      return addArgTypes(value);
    }
    case 'decorators': {
      return value.forEach((decorator) => addDecorator(decorator, false));
    }
    case 'loaders': {
      return value.forEach((loader) => addLoader(loader, false));
    }
    case 'parameters': {
      return addParameters({ ...value }, false);
    }
    case 'argTypesEnhancers': {
      return value.forEach((enhancer) => addArgTypesEnhancer(enhancer));
    }
    case 'globals':
    case 'globalTypes': {
      const v = {};
      v[key] = value;
      return addParameters(v, false);
    }
    default: {
      // eslint-disable-next-line prefer-template
      return console.log(key + ' was not supported :( !');
    }
  }
});
