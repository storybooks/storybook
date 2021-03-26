import { ArgTypes } from '@storybook/api';
import { SBType } from '@storybook/client-api';

const normalizeType = (type: SBType | string) => (typeof type === 'string' ? { name: type } : type);

const normalizeControl = (control?: any) =>
  typeof control === 'string' ? { type: control } : control;

export const normalizeArgTypes = (argTypes: ArgTypes) =>
  Object.entries(argTypes).reduce<ArgTypes>((acc, [key, argType]) => {
    const value = { ...argType };
    if (argType) {
      const { type, control } = argType;
      if (type) value.type = normalizeType(type);
      if (control) value.control = normalizeControl(control);
    }
    acc[key] = value;
    return acc;
  }, {});
