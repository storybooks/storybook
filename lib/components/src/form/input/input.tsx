import React, {
  FunctionComponent,
  forwardRef,
  HTMLProps,
  SelectHTMLAttributes,
  ChangeEvent,
  KeyboardEvent,
} from 'react';
import { styled, Theme, CSSObject } from '@storybook/theming';

import TextareaAutoResize, { TextareaAutosizeProps } from 'react-textarea-autosize';

import { Button as StyledButton } from '../../Button/Button';

const styleResets: CSSObject = {
  // resets
  appearance: 'none',
  border: '0 none',
  boxSizing: 'inherit',
  display: ' block',
  margin: ' 0',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',
  position: 'relative',
};

const styles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...styleResets,

  transition: 'all 200ms ease-out',
  color: theme.input.color || 'inherit',
  background: theme.input.background,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: '20px',
  padding: '6px 10px', // 32

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
    outline: 'none',
  },
  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '&:-webkit-autofill': { WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset` },

  '::placeholder': {
    color: theme.color.mediumdark,
  },
});

type Sizes = '100%' | 'flex' | 'auto';
type Alignments = 'end' | 'center' | 'start';
type ValidationStates = 'valid' | 'error' | 'warn';

export interface InputStyleProps {
  size?: Sizes;
  align?: Alignments;
  valid?: ValidationStates;
  height?: number;
}

const sizes = ({ size }: Pick<InputStyleProps, 'size'>): CSSObject => {
  switch (size) {
    case '100%': {
      return { width: '100%' };
    }
    case 'flex': {
      return { flex: 1 };
    }
    case 'auto':
    default: {
      return { display: 'inline' };
    }
  }
};
const alignment = ({ align }: Pick<InputStyleProps, 'align'>): CSSObject => {
  switch (align) {
    case 'end': {
      return { textAlign: 'right' };
    }
    case 'center': {
      return { textAlign: 'center' };
    }
    case 'start':
    default: {
      return { textAlign: 'left' };
    }
  }
};
const validation = ({
  valid,
  theme,
}: Pick<InputStyleProps, 'valid'> & { valid: ValidationStates; theme: Theme }): CSSObject => {
  switch (valid) {
    case 'valid': {
      return { boxShadow: `${theme.color.positive} 0 0 0 1px inset !important` };
    }
    case 'error': {
      return { boxShadow: `${theme.color.negative} 0 0 0 1px inset !important` };
    }
    case 'warn': {
      return {
        boxShadow: `${theme.color.warning} 0 0 0 1px inset`,
      };
    }
    case undefined:
    case null:
    default: {
      return {};
    }
  }
};

type InputProps = Omit<HTMLProps<HTMLInputElement>, keyof InputStyleProps> & InputStyleProps;
export const Input = Object.assign(
  styled(
    forwardRef<any, InputProps>(({ size, valid, align, ...props }, ref) => (
      <input {...props} ref={ref} />
    ))
  )<InputStyleProps>(styles, sizes, alignment, validation, {
    minHeight: 32,
  }),
  {
    displayName: 'Input',
  }
);

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof InputStyleProps> &
  InputStyleProps;
export const Select = Object.assign(
  styled(
    forwardRef<any, SelectProps>(({ size, valid, align, ...props }, ref) => (
      <select {...props} ref={ref} />
    ))
  )<SelectProps>(styles, sizes, validation, {
    height: 32,
    userSelect: 'none',
    paddingRight: 20,
    appearance: 'menulist',
  }),
  {
    displayName: 'Select',
  }
);

type TextareaProps = Omit<TextareaAutosizeProps, keyof InputStyleProps> & InputStyleProps;
export const Textarea = Object.assign(
  styled(
    forwardRef<any, TextareaProps>(({ size, valid, align, ...props }, ref) => (
      <TextareaAutoResize {...props} ref={ref} />
    ))
  )<TextareaProps>(styles, sizes, alignment, validation, ({ height = 400 }) => ({
    overflow: 'visible',
    maxHeight: height,
  })),
  {
    displayName: 'Textarea',
  }
);

const ButtonStyled = styled(
  forwardRef<any, InputStyleProps>(({ size, valid, align, ...props }, ref) => (
    <StyledButton {...props} ref={ref} />
  ))
)<InputStyleProps>(sizes, validation, {
  // Custom styling for color widget nested in buttons
  userSelect: 'none',
  overflow: 'visible',
  zIndex: 2,

  // overrides the default hover from Button
  '&:hover': {
    transform: 'none',
  },
});

export const Button: FunctionComponent<any> = Object.assign(
  forwardRef<{}, {}>((props, ref) => (
    <ButtonStyled {...props} {...{ tertiary: true, small: true, inForm: true }} ref={ref} />
  )),
  {
    displayName: 'Button',
  }
);

export const parse = (value: string) => {
  const result = parseFloat(value);
  return Number.isNaN(result) ? '' : result;
};

type NumericSizes = Sizes | 'content';

const numericSizes = ({ value, size }: { value?: number; size?: NumericSizes }): CSSObject => {
  switch (size) {
    case 'content': {
      return {
        width: `calc(${value ? value.toString().length : 1}ch + 20px)`,
        boxSizing: 'content-box',
        padding: '6px 10px',
        // Override the default 32 as we are using content-box.
        minHeight: 20,
      };
    }
    default: {
      return sizes({ size });
    }
  }
};

type NumericInputStyleProps = Omit<InputStyleProps, 'size'> & {
  size?: NumericSizes;
};

type NumericInputOwnProps = {
  value?: number;
  defaultValue?: number;
  onChange: (value: number | '') => number | void;
} & NumericInputStyleProps;
type NumericInputProps = Omit<HTMLProps<HTMLInputElement>, keyof NumericInputOwnProps> &
  NumericInputOwnProps;
export const NumericInput = Object.assign(
  styled(
    forwardRef<any, NumericInputProps>(
      ({ size, valid, align, onChange, onKeyDown, ...props }, ref) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          onChange(parse(event.target.value));
        };
        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.keyCode === 27) {
            event.currentTarget.blur();
          }
          if (onKeyDown) {
            onKeyDown(event);
          }
        };
        return (
          <input
            type="number"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...props}
            ref={ref}
          />
        );
      }
    )
  )<NumericInputStyleProps>(
    styles,
    alignment,
    validation,
    {
      minHeight: 32,
    },
    numericSizes
  ),
  {
    displayName: 'NumericInput',
  }
);
