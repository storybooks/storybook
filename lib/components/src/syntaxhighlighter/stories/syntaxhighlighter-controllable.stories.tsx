import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SyntaxHighlighter } from '../lazy-syntaxhighlighter';

export default {
  title: 'Basics/SyntaxHighlighter/Controllable',
  component: SyntaxHighlighter,
  argTypes: {
    language: { table: { disable: true } },
    renderer: { table: { disable: true } },
    SyntaxHighlighterProps: { table: { disable: true } },
  },
  parameters: {
    test: { disable: true },
    actions: { disable: true },
    layout: 'centered',
  },
} as ComponentMeta<typeof SyntaxHighlighter>;

const Template: ComponentStory<typeof SyntaxHighlighter> = (args) => (
  <SyntaxHighlighter language="json" {...args} style={{ height: 300, width: 500 }}>
    {`
      {
        "number": 1,
        "string": "something",
        "object": {
          "number": 1,
          "string": "something",
          "array": [1,2,3],
          "property": "value",
        },
        "array": [
          {
            "number": 2,
            "string": "something",
            "array": [1,2,3],
            "property": "value",
          },
          {
            "number": 3,
            "string": "something",
            "array": [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3],
            "property": "value",
          },
        ],
      }
      `}
  </SyntaxHighlighter>
);

export const Controllable = Template.bind({});
Controllable.args = {
  bordered: true,
  copyable: true,
  padded: true,
  format: true,
  showLineNumbers: false,
  useInlineStyles: false,
};
