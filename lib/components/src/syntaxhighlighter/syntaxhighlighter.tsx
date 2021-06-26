import React, { ComponentProps, FC, MouseEvent, useState, HTMLAttributes } from 'react';
import { logger } from '@storybook/client-logger';
import { styled } from '@storybook/theming';
import global from 'global';
import memoize from 'memoizerific';

import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import jsExtras from 'react-syntax-highlighter/dist/esm/languages/prism/js-extras';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import md from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import yml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';

import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

import { formatter } from './formatter';

const { navigator, document, window: globalWindow } = global;

ReactSyntaxHighlighter.registerLanguage('jsextra', jsExtras);
ReactSyntaxHighlighter.registerLanguage('jsx', jsx);
ReactSyntaxHighlighter.registerLanguage('json', json);
ReactSyntaxHighlighter.registerLanguage('yml', yml);
ReactSyntaxHighlighter.registerLanguage('md', md);
ReactSyntaxHighlighter.registerLanguage('bash', bash);
ReactSyntaxHighlighter.registerLanguage('css', css);
ReactSyntaxHighlighter.registerLanguage('html', html);
ReactSyntaxHighlighter.registerLanguage('tsx', tsx);
ReactSyntaxHighlighter.registerLanguage('typescript', typescript);
ReactSyntaxHighlighter.registerLanguage('graphql', graphql);

const themedSyntax = memoize(2)((theme) =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

let copyToClipboard: (text: string) => Promise<void>;

if (navigator?.clipboard) {
  copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
} else {
  copyToClipboard = async (text: string) => {
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = text;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();
  };
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

export interface SyntaxHighlighterRendererProps {
  rows: any[];
  stylesheet: string;
  useInlineStyles: boolean;
}

export type SyntaxHighlighterProps = {
  language: string;
  copyable?: boolean;
  bordered?: boolean;
  padded?: boolean;
  format?: boolean;
  showLineNumbers?: boolean;
  useInlineStyles?: boolean;
  SyntaxHighlighterProps?: ComponentProps<typeof ReactSyntaxHighlighter>;
  renderer?: (props: SyntaxHighlighterRendererProps) => React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const SyntaxHighlighter: FC<SyntaxHighlighterProps> = ({
  children,
  language = 'jsx',
  copyable = false,
  bordered = false,
  padded = false,
  format = true,
  SyntaxHighlighterProps = {},
  useInlineStyles = false,
  showLineNumbers = false,
  ...rest
}) => {
  if (typeof children !== 'string' || !children.trim()) {
    return null;
  }

  const highlightableCode = format ? formatter(children) : children.trim();
  const [copied, setCopied] = useState(false);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    copyToClipboard(highlightableCode)
      .then(() => {
        setCopied(true);
        globalWindow.setTimeout(() => setCopied(false), 1500);
      })
      .catch(logger.error);
  };

  return (
    <Wrapper bordered={bordered}>
      <Scrollable horizontal vertical {...rest}>
        <ReactSyntaxHighlighter
          padded={padded}
          language={language}
          showLineNumbers={showLineNumbers}
          showInlineLineNumbers={showLineNumbers}
          useInlineStyles={useInlineStyles}
          PreTag={Pre}
          CodeTag={Code}
          lineNumberContainerStyle={{}}
          {...SyntaxHighlighterProps}
        >
          {highlightableCode}
        </ReactSyntaxHighlighter>
      </Scrollable>
      {copyable ? (
        <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick }]} />
      ) : null}
    </Wrapper>
  );
};

export type WrapperProps = {
  bordered?: boolean;
};

const Wrapper = styled.div<WrapperProps>(
  { overflow: 'hidden', position: 'relative' },
  ({ theme, bordered }) =>
    bordered
      ? {
          border: `1px solid ${theme.appBorderColor}`,
          borderRadius: theme.borderRadius,
          background: theme.background.content,
        }
      : {}
);

const Scrollable = styled(ScrollArea)(
  ({ theme }) => ({
    color: theme.color.defaultText,
    '& code': {
      paddingRight: theme.layoutMargin,
    },
  }),
  ({ theme }) => themedSyntax(theme)
);

export interface PreProps {
  padded?: boolean;
}

const Pre = styled.pre<PreProps>(({ theme, padded }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  margin: 0,
  padding: padded ? theme.layoutMargin : 0,
}));

const Code = styled.code({
  flex: 1,
  paddingRight: 0,
  opacity: 1,
  width: '100%',
});

export default SyntaxHighlighter;
