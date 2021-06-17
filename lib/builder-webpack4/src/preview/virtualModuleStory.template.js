/* eslint-disable import/no-unresolved */
import { logger } from '@storybook/client-logger';
import { configure } from '{{frameworkImportPath}}';

try {
  configure(['{{stories}}'], module, false);
} catch (e) {
  logger.error(`
    configure was called automatically but failed.

    Did you call configure() in preview.js?
    If so, you should migrate to the new method of defining stories:
    https://storybook.js.org/docs/react/configure/overview

    It's also possible the call for configure failed for another reason,
    The error that occurred is below:
  `);
  logger.error(e);
}
