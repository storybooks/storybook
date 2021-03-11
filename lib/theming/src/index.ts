import emotionStyled, { CreateStyled } from '@emotion/styled';

export const styled = emotionStyled as CreateStyled;

export * from './base';
export * from './types';

export * from '@emotion/react';
export { default as isPropValid } from '@emotion/is-prop-valid';

export { createGlobal, createReset } from './global';
export * from './create';
export * from './convert';
export * from './ensure';

export { lightenColor as lighten, darkenColor as darken } from './utils';

export const ignoreSsrWarning =
  '/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */';
