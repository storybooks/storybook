import { logger } from '@storybook/client-logger';
import { Theme } from '@emotion/react';

import { deletedDiff } from 'deep-object-diff';
import dedent from 'ts-dedent';

import light from './themes/light';
import { ThemeVars } from './types';
import { convert } from './convert';

export const ensure = (input: ThemeVars): Theme => {
  if (!input) {
    return convert(light);
  }
  const missing = deletedDiff(light, input);
  if (Object.keys(missing).length) {
    logger.warn(
      dedent`
          Your theme is missing properties, you should update your theme!

          theme-data missing:
        `,
      missing
    );
  }

  return convert(input);
};
