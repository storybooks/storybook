import root from '@storybook/global-root';
import { parse } from 'qs';

const { document } = root;

export const getQueryParams = () => {
  // document.location is not defined in react-native
  if (document && document.location && document.location.search) {
    return parse(document.location.search, { ignoreQueryPrefix: true });
  }
  return {};
};

export const getQueryParam = (key: string) => {
  const params = getQueryParams();

  return params[key];
};
