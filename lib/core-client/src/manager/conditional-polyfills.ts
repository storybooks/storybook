import root from '@storybook/global-root';

export const importPolyfills = () => {
  const polyfills = [];

  if (!root.fetch) {
    // manually patch window.fetch;
    //    see issue: <https://github.com/developit/unfetch/issues/101#issuecomment-454451035>
    const patch = ({ default: fetch }: any) => {
      root.fetch = fetch;
    };

    polyfills.push(import('unfetch/dist/unfetch').then(patch));
  }

  return Promise.all(polyfills);
};
