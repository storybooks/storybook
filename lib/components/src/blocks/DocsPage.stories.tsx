import React from 'react';
import { Global, css } from '@storybook/theming';

import { Title, Subtitle, DocsPageWrapper } from './DocsPage';
import { ArgsTable, Source, Description } from './index';
import * as Story from './Story.stories';
import * as Preview from './Preview.stories';
import * as argsTable from './ArgsTable/ArgsTable.stories';
import * as source from './Source.stories';
import * as description from './Description.stories';

export default {
  title: 'Docs/DocsPage',
  component: DocsPageWrapper,
  // The goal of this decorator is to mimic some CSS reset.
  // Like Tailwind CSS or Bulma do, for example.
  decorators: [
    (storyFn) => (
      <>
        <Global
          styles={css`
            ul,
            ol {
              list-style: none;
            }
          `}
        />
        {storyFn()}
      </>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithSubtitle = () => (
  <DocsPageWrapper>
    <Title>DocsPage</Title>
    <Subtitle>
      What the DocsPage looks like. Meant to be QAed in Canvas tab not in Docs tab.
    </Subtitle>
    <Description {...description.Text.args} />
    <Preview.Single />
    <ArgsTable {...argsTable.Normal.args} />
    <Source {...source.JSX.args} />
  </DocsPageWrapper>
);

export const Empty = () => (
  <DocsPageWrapper>
    <Story.Error />
    <ArgsTable {...argsTable.Error.args} />
    <Source {...source.SourceUnavailable.args} />
  </DocsPageWrapper>
);

export const NoText = () => (
  <DocsPageWrapper>
    <Title>no text</Title>
    <Preview.Single />
    <ArgsTable {...argsTable.Normal.args} />
    <Source {...source.JSX.args} />
  </DocsPageWrapper>
);

export const Text = () => (
  <DocsPageWrapper>
    <Title>Sensorium</Title>
    <Description {...description.Text.args} />
    <Preview.Single />
    <ArgsTable {...argsTable.Normal.args} />
    <Source {...source.JSX.args} />
  </DocsPageWrapper>
);

export const Markdown = () => (
  <DocsPageWrapper>
    <Title>markdown</Title>
    <Description {...description.Markdown.args} />
    <Preview.Single />
    <ArgsTable {...argsTable.Normal.args} />
    <Source {...source.JSX.args} />
  </DocsPageWrapper>
);
