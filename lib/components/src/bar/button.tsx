import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { styled, isPropValid } from '@storybook/theming';

interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  href?: void;
}
interface LinkProps
  extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  href: string;
}

const ButtonOrLink = ({ children, ...restProps }: ButtonProps | LinkProps) =>
  restProps.href != null ? (
    <a {...(restProps as LinkProps)}>{children}</a>
  ) : (
    <button type="button" {...(restProps as ButtonProps)}>
      {children}
    </button>
  );

export interface TabButtonProps {
  active?: boolean;
  textColor?: string;
}

export const TabButton = styled(ButtonOrLink, { shouldForwardProp: isPropValid })<TabButtonProps>(
  {
    whiteSpace: 'normal',
    display: 'inline-flex',
    overflow: 'hidden',
    verticalAlign: 'top',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',

    '&:empty': {
      display: 'none',
    },
  },
  ({ theme }) => ({
    padding: '0 15px',
    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',
    height: 40,
    lineHeight: '12px',
    cursor: 'pointer',
    background: 'transparent',
    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    fontWeight: 'bold',
    fontSize: 13,

    '&:focus': {
      outline: '0 none',
      borderBottomColor: theme.color.secondary,
    },
  }),
  ({ active, textColor, theme }) =>
    active
      ? {
          color: textColor || theme.barSelectedColor,
          borderBottomColor: theme.barSelectedColor,
        }
      : {
          color: textColor || theme.barTextColor,
          borderBottomColor: 'transparent',
        }
);
TabButton.displayName = 'TabButton';

export interface IconButtonProps {
  active?: boolean;
}

export const IconButton = styled(ButtonOrLink, { shouldForwardProp: isPropValid })<IconButtonProps>(
  ({ theme }) => ({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    background: 'none',
    color: 'inherit',
    padding: 0,
    cursor: 'pointer',
    boxSizing: 'border-box',

    // Icon Buttons may have text depending on user preferences.
    // While we don't recommend having text for IconButtons, this style ensures that the text is the correct size.
    fontWeight: 'bold',
    fontSize: 13,

    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',

    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',

    '&:hover, &:focus': {
      outline: '0 none',
      color: theme.color.secondary,
    },
    '& > svg': {
      width: 15,
    },
  }),
  ({ active, theme }) =>
    active
      ? {
          outline: '0 none',
          borderBottomColor: theme.color.secondary,
        }
      : {}
);
IconButton.displayName = 'IconButton';
