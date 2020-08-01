import { document } from 'global';
import React, { Fragment, useEffect } from 'react';
import isChromatic from 'chromatic/isChromatic';
import {
  Global,
  ThemeProvider,
  themes,
  createReset,
  convert,
  styled,
  useTheme,
} from '@storybook/theming';
import { withCssResources } from '@storybook/addon-cssresources';
import { DocsPage } from '@storybook/addon-docs/blocks';

import addHeadWarning from './head-warning';

if (process.env.NODE_ENV === 'development') {
  if (!process.env.DOTENV_DEVELOPMENT_DISPLAY_WARNING) {
    addHeadWarning('dotenv-env', 'Dotenv development file not loaded');
  }

  if (!process.env.STORYBOOK_DISPLAY_WARNING) {
    addHeadWarning('env-glob', 'Global storybook env var not loaded');
  }

  if (process.env.DISPLAY_WARNING) {
    addHeadWarning('env-extra', 'Global non-storybook env var loaded');
  }
}

addHeadWarning('preview-head-not-loaded', 'Preview head not loaded');
addHeadWarning('dotenv-file-not-loaded', 'Dotenv file not loaded');

const ThemeBlock = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50vw',
    width: '50vw',
    height: '100vh',
    bottom: 0,
    overflow: 'auto',
    padding: 10,
  },
  ({ theme }) => ({
    background: theme.background.app,
    color: theme.color.defaultText,
  }),
  ({ side }) =>
    side === 'left'
      ? {
          left: 0,
          right: '50vw',
        }
      : {
          right: 0,
          left: '50vw',
        }
);

const ThemeStack = styled.div(
  {
    position: 'relative',
    minHeight: 'calc(50vh - 15px)',
  },
  ({ theme }) => ({
    background: theme.background.app,
    color: theme.color.defaultText,
  })
);

const ThemedSetRoot = () => {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.background = theme.background.app;
    document.body.style.color = theme.defaultText;
    return () => {
      //
    };
  });

  return null;
};

export const decorators = [
  withCssResources,
  (StoryFn, { globals: { theme = 'light' } }) => {
    switch (theme) {
      case 'side-by-side': {
        return (
          <Fragment>
            <ThemeProvider theme={convert(themes.light)}>
              <Global styles={createReset} />
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.light)}>
              <ThemeBlock side="left">
                <StoryFn />
              </ThemeBlock>
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.dark)}>
              <ThemeBlock side="right">
                <StoryFn />
              </ThemeBlock>
            </ThemeProvider>
          </Fragment>
        );
      }
      case 'stacked': {
        return (
          <Fragment>
            <ThemeProvider theme={convert(themes.light)}>
              <Global styles={createReset} />
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.light)}>
              <ThemeStack side="left">
                <StoryFn />
              </ThemeStack>
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.dark)}>
              <ThemeStack side="right">
                <StoryFn />
              </ThemeStack>
            </ThemeProvider>
          </Fragment>
        );
      }
      default: {
        return (
          <ThemeProvider theme={convert(themes[theme])}>
            <Global styles={createReset} />
            <ThemedSetRoot />
            <StoryFn />
          </ThemeProvider>
        );
      }
    }
  },
];

export const parameters = {
  exportedParameter: 'exportedParameter',
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  docs: {
    theme: themes.light,
    page: () => <DocsPage subtitleSlot={({ kind }) => `Subtitle: ${kind}`} />,
  },
};

export const globals = {
  foo: 'fooValue',
  colorScheme: 'dark',
};

export const globalTypes = {
  foo: { defaultValue: 'fooDefaultValue' },
  bar: { defaultValue: 'barDefaultValue' },
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: isChromatic() ? 'stacked' : 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
        { value: 'side-by-side', icon: 'sidebar', title: 'side by side' },
        { value: 'stacked', icon: 'bottombar', title: 'stacked' },
      ],
    },
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};
