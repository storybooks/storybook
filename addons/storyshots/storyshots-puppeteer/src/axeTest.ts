import '@wordpress/jest-puppeteer-axe';
import { defaultCommonConfig, CommonConfig } from './config';
import { puppeteerTest } from './puppeteerTest';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace,no-redeclare
  namespace jest {
    interface Matchers<R, T> {
      toPassAxeTests(parameters: any): R;
    }
  }
}

export const axeTest = (customConfig: Partial<CommonConfig> = {}) =>
  puppeteerTest({
    ...defaultCommonConfig,
    ...customConfig,
    async testBody(page, options) {
      const parameters = options.context.parameters.a11y;
      const include = parameters?.element ?? '#storybook-root';
      await expect(page).toPassAxeTests({ ...parameters, include });
    },
  });
