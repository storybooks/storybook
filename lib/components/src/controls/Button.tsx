import React, { FC } from 'react';

import { styled } from '@storybook/theming';
import { ControlProps, ButtonValue, ButtonConfig } from './types';

const Label = styled.label(({ theme }) => ({
  // FIXME: blatantly stolen from knobs, design review?
  button: {
    border: 0,
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 150ms ease-out',
    transform: 'translate3d(0,0,0)',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: 1,
    margin: 0,
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
    background: '#fafafa',
    color: '#333333',
    boxShadow: 'rgba(0,0,0,.1) 0 0 0 1px inset',
    borderRadius: '4px',
    padding: '10px 16px',
    display: 'inline',
    '&:focus': {
      outline: 'none',
      boxShadow: `${theme.color.secondary} 0 0 0 1px inset !important`,
    },
  },
}));

export type ButtonProps = ControlProps<ButtonValue> & ButtonConfig;
export const ButtonControl: FC<ButtonProps> = ({
  name,
  label = name, // FIXME: Use name if label is missing?
  defaultValue,
  value = defaultValue,
  onBlur,
  onFocus,
}) => (
  <Label htmlFor={name} title={label}>
    <button type="button" onClick={value} name={name} onBlur={onBlur} onFocus={onFocus}>
      {label}
    </button>
  </Label>
);
