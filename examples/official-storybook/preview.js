import { Symbols } from '@storybook/components';
import root from '@storybook/global-root';
import {
  convert,
  createReset,
  Global,
  styled,
  ThemeProvider,
  themes,
  useTheme,
} from '@storybook/theming';
import isChromatic from 'chromatic/isChromatic';
import React, { Fragment, useEffect } from 'react';
import addHeadWarning from './head-warning';

const { document } = root;

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
  (StoryFn, { globals: { theme = 'light' } }) => {
    switch (theme) {
      case 'side-by-side': {
        return (
          <Fragment>
            <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
            <ThemeProvider theme={convert(themes.light)}>
              <Global styles={createReset} />
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.light)}>
              <ThemeBlock side="left" data-side="left">
                <StoryFn />
              </ThemeBlock>
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.dark)}>
              <ThemeBlock side="right" data-side="right">
                <StoryFn />
              </ThemeBlock>
            </ThemeProvider>
          </Fragment>
        );
      }
      case 'stacked': {
        return (
          <Fragment>
            <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
            <ThemeProvider theme={convert(themes.light)}>
              <Global styles={createReset} />
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.light)}>
              <ThemeStack side="left" data-side="left">
                <StoryFn />
              </ThemeStack>
            </ThemeProvider>
            <ThemeProvider theme={convert(themes.dark)}>
              <ThemeStack side="right" data-side="right">
                <StoryFn />
              </ThemeStack>
            </ThemeProvider>
          </Fragment>
        );
      }
      default: {
        return (
          <ThemeProvider theme={convert(themes[theme])}>
            <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
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
  },
  controls: {
    presetColors: [
      { color: '#ff4785', title: 'Coral' },
      { color: '#1EA7FD', title: 'Ocean' },
      { color: 'rgb(252, 82, 31)', title: 'Orange' },
      { color: 'RGBA(255, 174, 0, 0.5)', title: 'Gold' },
      { color: 'hsl(101, 52%, 49%)', title: 'Green' },
      { color: 'HSLA(179,65%,53%,0.5)', title: 'Seafoam' },
      { color: '#6F2CAC', title: 'Purple' },
      { color: '#2A0481', title: 'Ultraviolet' },
      { color: 'black' },
      { color: '#333', title: 'Darkest' },
      { color: '#444', title: 'Darker' },
      { color: '#666', title: 'Dark' },
      { color: '#999', title: 'Mediumdark' },
      { color: '#ddd', title: 'Medium' },
      { color: '#EEE', title: 'Mediumlight' },
      { color: '#F3F3F3', title: 'Light' },
      { color: '#F8F8F8', title: 'Lighter' },
      { color: '#FFFFFF', title: 'Lightest' },
      '#fe4a49',
      '#FED766',
      'rgba(0, 159, 183, 1)',
      'HSLA(240,11%,91%,0.5)',
      'slategray',
    ],
  },
};

export const globals = {
  foo: 'fooValue',
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
      title: 'Theme',
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
    toolbar: {
      icon: 'globe',
      shortcuts: {
        next: {
          label: 'Go to next language',
          keys: ['L'],
        },
        previous: {
          label: 'Go to previous language',
          keys: ['shift', 'L'],
        },
        reset: {
          label: 'Reset language',
          keys: ['meta', 'shift', 'L'],
        },
      },
      items: [
        { title: 'Reset locale', type: 'reset' },
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'kr', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};

export const loaders = [async () => ({ globalValue: 1 })];
