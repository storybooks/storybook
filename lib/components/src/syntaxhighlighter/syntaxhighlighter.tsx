import React, {
  ComponentProps,
  FunctionComponent,
  MouseEvent,
  useState,
  useLayoutEffect,
} from 'react';
import { styled } from '@storybook/theming';
import { document, window } from 'global';
import memoize from 'memoizerific';

import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import html from 'react-syntax-highlighter/dist/cjs/languages/prism/markup';
import md from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import yml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';

import { PrismLight as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import createElement from 'react-syntax-highlighter/dist/cjs/create-element';
import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

import { formatter } from './formatter';

export { createElement as createSyntaxHighlighterElement };

ReactSyntaxHighlighter.registerLanguage('jsx', jsx);
ReactSyntaxHighlighter.registerLanguage('json', json);
ReactSyntaxHighlighter.registerLanguage('yml', yml);
ReactSyntaxHighlighter.registerLanguage('md', md);
ReactSyntaxHighlighter.registerLanguage('bash', bash);
ReactSyntaxHighlighter.registerLanguage('css', css);
ReactSyntaxHighlighter.registerLanguage('html', html);
ReactSyntaxHighlighter.registerLanguage('tsx', tsx);
ReactSyntaxHighlighter.registerLanguage('typescript', typescript);

const themedSyntax = memoize(2)((theme) =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

export interface WrapperProps {
  bordered?: boolean;
  padded?: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    color: theme.color.defaultText,
  }),
  ({ theme, bordered }) =>
    bordered
      ? {
          border: `1px solid ${theme.appBorderColor}`,
          borderRadius: theme.borderRadius,
          background: theme.background.content,
        }
      : {}
);

const Scroller = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))(
  {
    position: 'relative',
  },
  ({ theme }) => ({
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
});

export interface SyntaxHighlighterRendererProps {
  rows: any[];
  stylesheet: string;
  useInlineStyles: boolean;
}
export interface SyntaxHighlighterProps {
  language?: string;
  copyable?: boolean;
  bordered?: boolean;
  padded?: boolean;
  format?: boolean;
  className?: string;
  renderer?: (props: SyntaxHighlighterRendererProps) => React.ReactNode;
  children?: string;
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

type ReactSyntaxHighlighterProps = ComponentProps<typeof ReactSyntaxHighlighter>;

type Props = SyntaxHighlighterProps & ReactSyntaxHighlighterProps;
export const SyntaxHighlighter: FunctionComponent<Props> = ({
  children,
  language,
  copyable = false,
  bordered = false,
  padded = false,
  format = true,
  className = null,
  ...rest
}) => {
  const [copied, setCopied] = useState(false);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = children;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();

    setCopied(true);

    window.setTimeout(() => setCopied(false), 1500);
  };

  const [sourceCode, setSourceCode] = useState(() => children && children.trim());
  useLayoutEffect(() => {
    if (!children) {
      return () => {};
    }

    let mounted = true;
    if (format) {
      formatter(children.trim(), language).then((formatted) => {
        if (mounted) {
          setSourceCode(formatted);
        }
      });
    } else {
      setSourceCode(children.trim());
    }

    return () => {
      mounted = false;
    };
  }, [children]);

  return children ? (
    <Wrapper bordered={bordered} padded={padded} className={className}>
      <Scroller>
        <ReactSyntaxHighlighter
          padded={padded || bordered}
          language={language || 'jsx'}
          useInlineStyles={false}
          PreTag={Pre}
          CodeTag={Code}
          lineNumberContainerStyle={{}}
          {...rest}
        >
          {sourceCode}
        </ReactSyntaxHighlighter>
      </Scroller>

      {copyable ? (
        <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick }]} />
      ) : null}
    </Wrapper>
  ) : null;
};
