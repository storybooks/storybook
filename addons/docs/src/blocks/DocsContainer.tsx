import React, { FunctionComponent, useEffect } from 'react';
import { document, window } from 'global';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider, ensure as ensureTheme, themes as builtInThemes } from '@storybook/theming';
import { DocsWrapper, DocsContent } from '@storybook/components';
import { components as htmlComponents } from '@storybook/components/html';
import { useGlobalArgs } from '@storybook/api';
import { DocsContextProps, DocsContext } from './DocsContext';
import { anchorBlockIdFromId } from './Anchor';
import { storyBlockIdFromId } from './Story';
import { SourceContainer } from './SourceContainer';
import { CodeOrSourceMdx, AnchorMdx, HeadersMdx } from './mdx';
import { scrollToElement } from './utils';

export interface DocsContainerProps {
  context: DocsContextProps;
}

const defaultComponents = {
  ...htmlComponents,
  code: CodeOrSourceMdx,
  a: AnchorMdx,
  ...HeadersMdx,
};

export const DocsContainer: FunctionComponent<DocsContainerProps> = ({ context, children }) => {
  const { id: storyId = null, globalArgs = {}, parameters = {} } = context || {};
  const { colorScheme = 'light', themes = builtInThemes } = globalArgs;
  const { docs = {} } = parameters;
  const themeVars = docs.theme;
  // if (!themeVars && options.theme) {
  //   deprecate(
  //     () => {},
  //     dedent`
  //       options.theme => Deprecated: use  story.parameters.docs.theme instead.
  //       See https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/theming.md#storybook-theming for details.
  //   `
  //   )();
  //   themeVars = options.theme;
  // }
  // const theme = ensureTheme(themeVars);
  const allComponents = { ...defaultComponents, ...docs.components };
  const theme = ensureTheme(themes[colorScheme]);

  useEffect(() => {
    let url;
    try {
      url = new URL(window.parent.location);
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
        let block = 'start';
        if (allStories && allStories[0] === element) {
          block = 'end'; // first story should be shown with the intro content above
        }
        // Introducing a delay to ensure scrolling works when it's a full refresh.
        setTimeout(() => {
          scrollToElement(element, block);
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
