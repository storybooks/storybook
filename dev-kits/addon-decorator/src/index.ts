/* eslint-disable no-console */
import { document } from 'global';
import { useEffect } from '@storybook/client-api';

const root = document && document.getElementById('storybook-root');

export const createDecorator = () => (options: any) => (storyFn: () => any) => {
  useEffect(() => {
    if (root != null) {
      console.log('story was rendered');
      return () => {
        console.log('story was removed');
      };
    }
    return undefined;
  }, [root, options]);

  return storyFn();
};

export const withDecorator = createDecorator();
