import React, { FC, ChangeEvent } from 'react';

import { styled } from '@storybook/theming';
import { lighten, darken, rgba } from 'polished';
import { ControlProps, NumberValue, RangeConfig } from './types';
import { parse } from './Number';

type RangeProps = ControlProps<NumberValue | null> & RangeConfig;

const RangeInput = styled.input(({ theme }) => ({
  // Resytled using http://danielstern.ca/range.css/#/
  '&': {
    width: '100%',
    backgroundColor: 'transparent',
    appearance: 'none',
  },

  '&::-webkit-slider-runnable-track': {
    background:
      theme.base === 'light'
        ? darken(0.02, theme.input.background)
        : lighten(0.02, theme.input.background),
    border: `1px solid ${theme.appBorderColor}`,
    borderRadius: 6,
    width: '100%',
    height: 6,
    cursor: 'pointer',
  },

  '&::-webkit-slider-thumb': {
    marginTop: '-6px',
    width: 16,
    height: 16,

    border: `1px solid ${rgba(theme.appBorderColor, 0.2)}`,
    borderRadius: '50px',
    boxShadow: `0 1px 3px 0px ${rgba(theme.appBorderColor, 0.2)}`,
    cursor: 'grab',
    appearance: 'none',
    background: `${theme.input.background}`,
    transition: 'all 150ms ease-out',

    '&:hover': {
      background: `${darken(0.05, theme.input.background)}`,
      transform: 'scale3d(1.1, 1.1, 1.1) translateY(-1px)',
      transition: 'all 50ms ease-out',
    },

    '&:active': {
      background: `${theme.input.background}`,
      transform: 'scale3d(1, 1, 1) translateY(0px)',
      cursor: 'grabbing',
    },
  },

  '&:focus': {
    outline: 'none',

    '&::-webkit-slider-runnable-track': {
      borderColor: rgba(theme.color.secondary, 0.4),
      background: theme.background.hoverable,
    },

    '&::-webkit-slider-thumb': {
      borderColor: theme.color.secondary,
      boxShadow: `0 0px 5px 0px ${theme.color.secondary}`,
    },
  },

  '&::-moz-range-track': {
    background:
      theme.base === 'light'
        ? darken(0.02, theme.input.background)
        : lighten(0.02, theme.input.background),
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
    width: '100%',
    height: 6,
    cursor: 'pointer',
    outline: 'none',
  },

  '&::-moz-range-thumb': {
    width: 16,
    height: 16,
    border: `1px solid ${rgba(theme.color.border, 0.2)}`,
    borderRadius: '50px',
    boxShadow: `0 1px 3px 0px ${rgba(theme.color.border, 0.2)}`,
    cursor: 'grab',
    background: `${theme.input.background}`,
    transition: 'all 150ms ease-out',

    '&:hover': {
      background: `${darken(0.05, theme.input.background)}`,
      transform: 'scale3d(1.1, 1.1, 1.1) translateY(-1px)',
      transition: 'all 50ms ease-out',
    },

    '&:active': {
      background: `${theme.input.background}`,
      transform: 'scale3d(1, 1, 1) translateY(0px)',
      cursor: 'grabbing',
    },
  },
  '&::-ms-track': {
    background:
      theme.base === 'light'
        ? darken(0.02, theme.input.background)
        : lighten(0.02, theme.input.background),
    borderColor: 'transparent',
    borderWidth: '7.3px 0',
    color: 'transparent',
    width: '100%',
    height: '6px',
    cursor: 'pointer',
  },
  '&::-ms-fill-lower': {
    background: '#dadada',
    border: `1px solid ${theme.appBorderColor}`,
    borderRadius: 6,
  },
  '&::-ms-fill-upper': {
    background: '#dddddd',
    border: `1px solid ${theme.appBorderColor}`,
    borderRadius: 6,
  },
  '&::-ms-thumb': {
    width: 16,
    height: 16,
    background: `${theme.input.background}`,
    border: `1px solid ${rgba(theme.appBorderColor, 0.2)}`,
    borderRadius: 50,
    cursor: 'grab',
    marginTop: 0,
  },
  '&:focus::-ms-fill-lower': { background: '#dddddd' },
  '&:focus::-ms-fill-upper': { background: '#e0e0e0' },
  '@supports (-ms-ime-align:auto)': { 'input[type=range]': { margin: '0' } },
}));

const RangeLabel = styled.span({
  paddingLeft: 5,
  paddingRight: 5,
  fontSize: 12,
  whiteSpace: 'nowrap',
});

const RangeWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const RangeControl: FC<RangeProps> = ({
  name,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  onBlur,
  onFocus,
  readOnly,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parse(event.target.value));
  };
  return (
    <RangeWrapper>
      <RangeLabel>{min}</RangeLabel>
      <RangeInput
        type="range"
        onChange={handleChange}
        {...{ name, value, min, max, step, onFocus, onBlur, readOnly }}
      />
      <RangeLabel>{`${value} / ${max}`}</RangeLabel>
    </RangeWrapper>
  );
};
