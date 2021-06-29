import { styled } from '@storybook/theming';
import React, { forwardRef, HTMLAttributes, ReactNode, RefObject } from 'react';
import { Icons, IconsProps } from '../icon/icon';

export type TabsButtonProps = {
  adornmentEnd?: ReactNode;
  adornmentStart?: ReactNode;
  active?: boolean;
  activeColor?: string;
  textColor?: string;
  icon?: IconsProps['icon'];
  Icon?: ReactNode;
  narrow?: boolean;
  label?: ReactNode;
  LabelProps?: HTMLAttributes<HTMLSpanElement>;
} & HTMLAttributes<HTMLButtonElement>;

export const TabsButton = forwardRef(
  (props: TabsButtonProps, ref: RefObject<HTMLButtonElement>) => {
    const {
      active,
      adornmentStart,
      adornmentEnd,
      textColor,
      icon,
      Icon,
      label,
      narrow,
      activeColor,
      LabelProps = {},
      ...rest
    } = props;
    let ButtonIcon = Icon;

    if (icon) {
      ButtonIcon = <Icons icon={icon} />;
    }

    return (
      <Wrapper
        data-sb-tabs-button=""
        active={active}
        narrow={narrow}
        textColor={textColor}
        activeColor={activeColor}
        ref={ref}
        {...rest}
      >
        {ButtonIcon && (
          <IconWrapper data-sb-tabsbutton-icon="" hasLabel={label !== undefined}>
            {ButtonIcon}
          </IconWrapper>
        )}
        {adornmentStart}
        {label && (
          <span data-sb-tabsbutton-label="" {...LabelProps}>
            {label}
          </span>
        )}
        {adornmentEnd}
      </Wrapper>
    );
  }
);

interface WrapperProps {
  active: boolean;
  textColor: string;
  activeColor: string;
  narrow: boolean;
}

const Wrapper = styled.button<WrapperProps>(
  {
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',
    height: 40,
    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',
    lineHeight: '12px',
    cursor: 'pointer',
    background: 'transparent',
    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    fontWeight: 'bold',
    fontSize: 13,
  },
  ({ narrow }) => ({
    padding: `0 ${narrow ? 0 : 16}px`,
  }),
  ({ theme, activeColor }) => ({
    '&:focus,&:active': {
      outline: '0 none',
      color: activeColor || theme.barSelectedColor,
      borderBottomColor: activeColor || theme.barSelectedColor,
    },
  }),
  ({ activeColor, theme }) => ({
    '&:hover': {
      color: activeColor || theme.barSelectedColor,
    },
  }),
  ({ active, textColor, activeColor, theme }) =>
    active
      ? {
          color: activeColor || theme.barSelectedColor,
          borderBottomColor: activeColor || theme.barSelectedColor,
        }
      : {
          color: textColor || theme.barTextColor,
          borderBottomColor: 'transparent',
        }
);

interface IconWrapperProps {
  hasLabel: boolean;
}

const IconWrapper = styled.span<IconWrapperProps>(
  {
    '& svg': {
      height: 15,
    },
  },
  ({ hasLabel }) =>
    hasLabel && {
      '& svg': {
        height: 11,
        marginRight: 4,
      },
    }
);
