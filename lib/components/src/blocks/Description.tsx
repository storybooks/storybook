import React, { FunctionComponent } from 'react';
import Markdown from 'markdown-to-jsx';
import { ResetWrapper } from '../typography/DocumentFormatting';
import { components } from '../html';

export interface DescriptionProps {
  markdown: string;
  className?: string;
}

/**
 * A markdown description for a component, typically used to show the
 * components docgen docs.
 */
export const Description: FunctionComponent<DescriptionProps> = ({ markdown, className }) => (
  <ResetWrapper className={className}>
    <Markdown options={{ forceBlock: true, overrides: components }}>{markdown}</Markdown>
  </ResetWrapper>
);
