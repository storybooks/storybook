import React, { FC, ChangeEvent } from 'react';
import { styled } from '@storybook/theming';

import { Form } from '../form';
import { ControlProps, TextValue, TextConfig } from './types';

export type TextProps = ControlProps<TextValue | undefined> & TextConfig;

const Wrapper = styled.label({
  display: 'flex',
});

const format = (value?: TextValue) => value || '';

export const TextControl: FC<TextProps> = ({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  readOnly,
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };
  return (
    <Wrapper>
      <Form.Textarea
        id={name}
        onChange={handleChange}
        size="flex"
        placeholder="Adjust string dynamically"
        {...{ name, value: format(value), onFocus, onBlur, readOnly }}
      />
    </Wrapper>
  );
};
