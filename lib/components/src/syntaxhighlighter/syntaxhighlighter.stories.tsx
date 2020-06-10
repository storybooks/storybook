import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider, themes, ensure } from '@storybook/theming';
import { SyntaxHighlighter } from './syntaxhighlighter';

storiesOf('Basics/SyntaxHighlighter', module)
  .add('bash', () => (
    <SyntaxHighlighter language="bash" copyable={false}>
      npx npm-check-updates '/storybook/' -u && npm install
    </SyntaxHighlighter>
  ))
  .add('css', () => (
    <SyntaxHighlighter language="css" copyable={false}>
      {`
        .className {
          border: 1px solid hotpink;
        }
      `}
    </SyntaxHighlighter>
  ))
  .add('json', () => (
    <SyntaxHighlighter language="json" copyable={false}>
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
  ))
  .add('markdown', () => (
    <SyntaxHighlighter language="markdown" copyable={false}>
      {`
      # a big header

      some code:

      ~~~js
      const name = "a string";
      ~~~

      > crazy

      `}
    </SyntaxHighlighter>
  ))
  .add('yaml', () => (
    <SyntaxHighlighter language="yaml" copyable={false}>
      {`
        product:
        - sku         : BL394D
          quantity    : 4
          description : Basketball
          price       : 450.00
      `}
    </SyntaxHighlighter>
  ))
  .add('jsx', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things all={true} /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('js', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
      {`import React, { createElement } from 'react';
        import { Good, Things } from 'life';

        const result = () => createElement(Good, [createElement(Things, [], { all: true }), []);

        console.log(result);

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('unsupported', () => (
    <SyntaxHighlighter language="C#" bordered copyable>
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
  ))
  .add('dark unsupported', () => {
    const theme = ensure(themes.dark);
    return (
      <ThemeProvider theme={theme}>
        <SyntaxHighlighter bordered language="C#" copyable>
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
  })
  .add('story', () => (
    <SyntaxHighlighter language="jsx" copyable={false}>
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
  ))
  .add('bordered & copy-able', () => (
    <SyntaxHighlighter language="jsx" copyable bordered>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('padded', () => (
    <SyntaxHighlighter language="jsx" padded>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('showLineNumbers', () => (
    <SyntaxHighlighter language="jsx" copyable={false} showLineNumbers>
      {`import { Good, Things } from 'life';

        const result = () => <Good><Things /></Good>;

        export { result as default };
      `}
    </SyntaxHighlighter>
  ))
  .add('format', () => (
    <SyntaxHighlighter language="jsx" format>
      {`
        import { Good, Things, And, Wonderful, People } from 'life';
        const result = () => <And><Good><Things /></Good><Wonderful>
        <People /></Wonderful></And>;
        export { result as default };
      `}
    </SyntaxHighlighter>
  ));
