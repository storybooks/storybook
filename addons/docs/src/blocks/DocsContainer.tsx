import { MDXProvider } from '@mdx-js/react';
import { components as htmlComponents, DocsContent, DocsWrapper } from '@storybook/components';
import root from '@storybook/global-root';
import { ensure as ensureTheme, ThemeProvider } from '@storybook/theming';
import React, { FunctionComponent, useEffect } from 'react';
import dedent from 'ts-dedent';
import deprecate from 'util-deprecate';
import { anchorBlockIdFromId } from './Anchor';
import { DocsContext, DocsContextProps } from './DocsContext';
import { AnchorMdx, CodeOrSourceMdx, HeadersMdx } from './mdx';
import { SourceContainer } from './SourceContainer';
import { storyBlockIdFromId } from './Story';
import { scrollToElement } from './utils';

const { document } = root;

export interface DocsContainerProps {
  context: DocsContextProps;
}

const defaultComponents = {
  ...htmlComponents,
  code: CodeOrSourceMdx,
  a: AnchorMdx,
  ...HeadersMdx,
};

const warnOptionsTheme = deprecate(
  () => {},
  dedent`
    Deprecated parameter: options.theme => docs.theme

    https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/theming.md#storybook-theming
`
);

export const DocsContainer: FunctionComponent<DocsContainerProps> = ({ context, children }) => {
  const { id: storyId = null, parameters = {} } = context || {};
  const { options = {}, docs = {} } = parameters;
  let themeVars = docs.theme;
  if (!themeVars && options.theme) {
    warnOptionsTheme();
    themeVars = options.theme;
  }
  const theme = ensureTheme(themeVars);
  const allComponents = { ...defaultComponents, ...docs.components };

  useEffect(() => {
    let url;
    try {
      url = new URL(root.parent.location.toString());
    } catch (err) {
      return;
    }
    if (url.hash) {
      const element = document.getElementById(url.hash.substring(1));
      if (element) {
        // Introducing a delay to ensure scrolling works when it's a full refresh.
        setTimeout(() => {
          scrollToElement(element);
        }, 200);
      }
    } else {
      const element =
        document.getElementById(anchorBlockIdFromId(storyId)) ||
        document.getElementById(storyBlockIdFromId(storyId));
      if (element) {
        const allStories = element.parentElement.querySelectorAll('[id|="anchor-"]');
        let scrollTarget = element;
        if (allStories && allStories[0] === element) {
          // Include content above first story
          scrollTarget = document.getElementById('docs-root');
        }
        // Introducing a delay to ensure scrolling works when it's a full refresh.
        setTimeout(() => {
          scrollToElement(scrollTarget, 'start');
        }, 200);
      }
    }
  }, [storyId]);

  return (
    <DocsContext.Provider value={context}>
      <SourceContainer>
        <ThemeProvider theme={theme}>
          <MDXProvider components={allComponents}>
            <DocsWrapper className="sbdocs sbdocs-wrapper">
              <DocsContent className="sbdocs sbdocs-content">{children}</DocsContent>
            </DocsWrapper>
          </MDXProvider>
        </ThemeProvider>
      </SourceContainer>
    </DocsContext.Provider>
  );
};
