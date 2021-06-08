import React from 'react';
import { useGlobals } from '@storybook/client-api';
import { Meta, Story } from '@storybook/react/types-6-0';
import { LocaleText, LocaleTextProps } from './locale-text';

export default {
  component: LocaleText,
  title: 'Examples / Locale Text',
  parameters: {
    docs: {
      description: {
        component: 'Uses Storybook globals to switch displayed locale. Select 🌐 from toolbar.',
      },
    },
  },
} as Meta;

const Template: Story<LocaleTextProps> = (args) => {
  const [{ locale }] = useGlobals();
  return <LocaleText {...args} locale={locale} />;
};

export const Basic = Template.bind({});
Basic.args = {
  fallback: 'Hello World',
  en: 'Hello World',
  es: 'Hola Mundo',
  fr: 'Bonjour le monde',
  zh: '你好，世界',
  kr: '안녕 세상아',
};
