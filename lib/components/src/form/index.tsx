import { styled } from '@storybook/theming';
import { Field } from './field/field';
// InputStyleProps import is for TS
import { InputStyleProps, Input, Select, Textarea, Button, NumericInput } from './input/input';

export const Form = Object.assign(
  styled.form({
    boxSizing: 'border-box',
    width: '100%',
  }),
  {
    Field,
    Input,
    Select,
    Textarea,
    Button,
    NumericInput,
  }
);
