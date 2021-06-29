declare module '@storybook/semver';
declare module 'preval.macro';

// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
declare var requestIdleCallback: (callback: Function, options: { timeout?: number }) => string;
// https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback
declare var cancelIdleCallback: (handle: string) => undefined;
