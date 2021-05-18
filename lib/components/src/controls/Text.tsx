import React, { FC, ChangeEvent } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '../form';
import { ControlProps, TextValue, TextConfig } from './types';

export type TextProps = ControlProps<TextValue | undefined> & TextConfig;

const Wrapper = styled.label({
  display: 'flex',
});

const MaxLength = styled.div<{ isMaxed: boolean }>(({ isMaxed }) => ({
  marginLeft: '0.75rem',
  paddingTop: '0.35rem',
  color: isMaxed ? 'red' : undefined,
}));

const format = (value?: TextValue) => value || '';

export const TextControl: FC<TextProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  maxLength,
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };
  return (
    <Wrapper>
      <Form.Textarea
        id={name}
        maxLength={maxLength}
        onChange={handleChange}
        size="flex"
        placeholder="Adjust string dynamically"
        {...{ name, value: format(value), onFocus, onBlur }}
      />
      {maxLength && (
        <MaxLength isMaxed={value?.length === maxLength}>
          {value?.length ?? 0} / {maxLength}
        </MaxLength>
      )}
    </Wrapper>
  );
};
