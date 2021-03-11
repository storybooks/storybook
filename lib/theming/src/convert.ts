import { opacify } from 'polished';
import { Theme } from '@emotion/react';
import { background, typography, color } from './base';
import { Color, ThemeVars } from './types';
import { easing, animation } from './animation';
import { create as createSyntax, chromeLight, chromeDark } from './modules/syntax';
import { getPreferredColorScheme } from './utils';
import { themes } from './create';

const lightSyntaxColors = {
  green1: '#008000',
  red1: '#A31515',
  red2: '#9a050f',
  red3: '#800000',
  red4: '#ff0000',
  gray1: '#393A34',
  cyan1: '#36acaa',
  cyan2: '#2B91AF',
  blue1: '#0000ff',
  blue2: '#00009f',
};

const darkSyntaxColors = {
  green1: '#7C7C7C',
  red1: '#92C379',
  red2: '#9a050f',
  red3: '#A8FF60',
  red4: '#96CBFE',
  gray1: '#EDEDED',
  cyan1: '#C6C5FE',
  cyan2: '#FFFFB6',
  blue1: '#B474DD',
  blue2: '#00009f',
};

const createColors = (vars: ThemeVars): Color => ({
  // Changeable colors
  primary: vars.colorPrimary,
  secondary: vars.colorSecondary,
  tertiary: color.tertiary,
  ancillary: color.ancillary,

  // Complimentary
  orange: color.orange,
  gold: color.gold,
  green: color.green,
  seafoam: color.seafoam,
  purple: color.purple,
  ultraviolet: color.ultraviolet,

  // Monochrome
  lightest: color.lightest,
  lighter: color.lighter,
  light: color.light,
  mediumlight: color.mediumlight,
  medium: color.medium,
  mediumdark: color.mediumdark,
  dark: color.dark,
  darker: color.darker,
  darkest: color.darkest,

  // For borders
  border: color.border,

  // Status
  positive: color.positive,
  negative: color.negative,
  warning: color.warning,
  critical: color.critical,

  defaultText: vars.textColor || color.darkest,
  inverseText: vars.textInverseColor || color.lightest,
});

export const convert = (inherit: ThemeVars = themes[getPreferredColorScheme()]): Theme => {
  const {
    base,
    colorPrimary,
    colorSecondary,
    appBg,
    appContentBg,
    appBorderColor,
    appBorderRadius,
    fontBase,
    fontCode,
    textColor,
    textInverseColor,
    barTextColor,
    barSelectedColor,
    barBg,
    inputBg,
    inputBorder,
    inputTextColor,
    inputBorderRadius,
    brandTitle,
    brandUrl,
    brandImage,
    gridCellSize,
    ...rest
  } = inherit;

  return {
    ...(rest || {}),

    base,
    color: createColors(inherit),
    background: {
      app: appBg,
      bar: barBg,
      content: appContentBg,
      gridCellSize: gridCellSize || background.gridCellSize,
      hoverable:
        base === 'light' ? 'rgba(0,0,0,.05)' : 'rgba(250,250,252,.1)' || background.hoverable,

      positive: background.positive,
      negative: background.negative,
      warning: background.warning,
      critical: background.critical,
    },
    typography: {
      fonts: {
        base: fontBase,
        mono: fontCode,
      },
      weight: typography.weight,
      size: typography.size,
    },
    animation,
    easing,

    input: {
      border: inputBorder,
      background: inputBg,
      color: inputTextColor,
      borderRadius: inputBorderRadius,
    },

    // UI
    layoutMargin: 10,
    appBorderColor,
    appBorderRadius,

    // Toolbar default/active colors
    barTextColor,
    barSelectedColor: barSelectedColor || colorSecondary,
    barBg,

    // Brand logo/text
    brand: {
      title: brandTitle,
      url: brandUrl,
      image: brandImage || (brandTitle ? null : undefined),
    },

    code: createSyntax({
      colors: base === 'light' ? lightSyntaxColors : darkSyntaxColors,
      mono: fontCode,
    }),

    // Addon actions theme
    // API example https://github.com/xyc/react-inspector/blob/master/src/styles/themes/chromeLight.js
    addonActionsTheme: {
      ...(base === 'light' ? chromeLight : chromeDark),

      BASE_FONT_FAMILY: fontCode,
      BASE_FONT_SIZE: typography.size.s2 - 1,
      BASE_LINE_HEIGHT: '18px',
      BASE_BACKGROUND_COLOR: 'transparent',
      BASE_COLOR: textColor,
      ARROW_COLOR: opacify(0.2, appBorderColor),
      ARROW_MARGIN_RIGHT: 4,
      ARROW_FONT_SIZE: 8,
      TREENODE_FONT_FAMILY: fontCode,
      TREENODE_FONT_SIZE: typography.size.s2 - 1,
      TREENODE_LINE_HEIGHT: '18px',
      TREENODE_PADDING_LEFT: 12,
    },
  };
};
