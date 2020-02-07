import React from 'react';
import { TypescriptButton } from '../../components/TypescriptButton';

export default {
  title: `Addons/Docs/typescript`,
  component: TypescriptButton,
};

export const Basic = () => <TypescriptButton label="Button" />;

export const AnotherStory = () => <TypescriptButton label="Secod" property1={10} />;
