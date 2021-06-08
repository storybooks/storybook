import React, { HTMLAttributes } from 'react';

export interface LocaleTextProps extends HTMLAttributes<HTMLSpanElement> {
  locale: 'en' | 'fr' | 'es' | 'zh' | 'kr';
  fallback: string;
  en?: string;
  fr?: string;
  es?: string;
  zh?: string;
  kr?: string;
}

export const LocaleText = ({ locale, en, fr, es, zh, kr, fallback, ...props }: LocaleTextProps) => (
  <span {...props}>{{ en, fr, es, zh, kr }[locale] || fallback}</span>
);
