import { ComponentMeta } from '@storybook/react';
import { ensure, ThemeProvider, themes } from '@storybook/theming';
import React from 'react';
import { SyntaxHighlighter } from '../lazy-syntaxhighlighter';

export default {
  title: 'Basics/SyntaxHighlighter/Stories',
  component: SyntaxHighlighter,
  parameters: {
    test: { disable: true },
    actions: { disable: true },
    controls: { disable: true },
  },
} as ComponentMeta<typeof SyntaxHighlighter>;

export const bash = () => (
  <SyntaxHighlighter language="bash">
    npx npm-check-updates '/storybook/' -u && npm install
  </SyntaxHighlighter>
);

export const css = () => (
  <SyntaxHighlighter language="css">
    {`
    .className {
      border: 1px solid hotpink;
    }
    `}
  </SyntaxHighlighter>
);

export const json = () => (
  <SyntaxHighlighter language="json">
    {`
    {
      "number": 1,
      "string": "something",
      "object": {
        "property": "value",
      },
      array: [1,2,3],
    }
    `}
  </SyntaxHighlighter>
);

export const markdown = () => (
  <SyntaxHighlighter language="markdown">
    {`
    # a big header

    some code:

    ~~~js
    const name = "a string";
    ~~~

    > crazy

    `}
  </SyntaxHighlighter>
);

export const yaml = () => (
  <SyntaxHighlighter language="yaml">
    {`
    product:
    - sku         : BL394D
      quantity    : 4
      description : Basketball
      price       : 450.00
    `}
  </SyntaxHighlighter>
);

export const js = () => (
  <SyntaxHighlighter language="jsx">
    {`
    import React, { createElement } from 'react';
    import { Good, Things } from 'life';

    const result = () => createElement(Good, [createElement(Things, [], { all: true }), []);

    console.log(result);

    export { result as default };
    `}
  </SyntaxHighlighter>
);

export const jsx = () => (
  <SyntaxHighlighter language="jsx">
    {`
    import { Good, Things } from 'life';

    const result = () => <Good><Things all={true} /></Good>;

    export { result as default };
    `}
  </SyntaxHighlighter>
);

export const graphql = () => (
  <SyntaxHighlighter language="graphql">
    {`query HeroNameAndFriends($episode: Episode) {
      hero(episode: $episode) {
        name
        friends {
          name
        }
      }
    }
  `}
  </SyntaxHighlighter>
);

export const unsupported = () => (
  <SyntaxHighlighter language="C#">
    {`
    // A Hello World! program in C#.
    using System;
    namespace HelloWorld
    {
      class Hello 
      {
        static void Main() 
        {
          Console.WriteLine("Hello World!");

          // Keep the console window open in debug mode.
          Console.WriteLine("Press any key to exit.");
          Console.ReadKey();
        }
      }
    }
  `}
  </SyntaxHighlighter>
);

export const unsupportedDarkMode = () => {
  const theme = ensure(themes.dark);
  return (
    <ThemeProvider theme={theme}>
      <SyntaxHighlighter bordered language="C#">
        {`
          // A Hello World! program in C#.
          using System;
          namespace HelloWorld
          {
            class Hello 
            {
              static void Main() 
              {
                Console.WriteLine("Hello World!");

                // Keep the console window open in debug mode.
                Console.WriteLine("Press any key to exit.");
                Console.ReadKey();
              }
            }
          }
        `}
      </SyntaxHighlighter>
    </ThemeProvider>
  );
};

export const storybookStory = () => (
  <SyntaxHighlighter language="jsx">
    {`
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import { styled } from '@storybook/theming';

  import Heading from './heading';

  const Holder = styled.div({
    margin: 10,
    border: '1px dashed deepskyblue',
    // overflow: 'hidden',
  });

  storiesOf('Basics|Heading', module).add('types', () => (
    <div>
      <Holder>
        <Heading>DEFAULT WITH ALL CAPS</Heading>
      </Holder>
      <Holder>
        <Heading sub="With a great sub">THIS LONG DEFAULT WITH ALL CAPS & SUB</Heading>
      </Holder>
      <Holder>
        <Heading type="page">page type</Heading>
      </Holder>
      <Holder>
        <Heading type="page" sub="With a sub">
          page type
        </Heading>
      </Holder>
    </div>
  ));
`}
  </SyntaxHighlighter>
);
