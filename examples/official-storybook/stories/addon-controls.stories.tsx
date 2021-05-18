import React from 'react';
import Button from '../components/TsButton';

export default {
  title: 'Addons/Controls',
  component: Button,
  argTypes: {
    children: { control: 'text', name: 'Children', mapping: { basic: 'BASIC' } },
    type: { name: 'Type', control: { type: 'text', maxLength: 32 } },
    json: { control: 'object', name: 'JSON' },
    imageUrls: { control: { type: 'file', accept: '.png' }, name: 'Image Urls' },
    label: {
      name: 'Label',
      options: ['Plain', 'Bold'],
      control: { type: 'select', labels: { Bold: 'BOLD' } },
      mapping: { Bold: <b>Bold</b> },
    },
    background: {
      name: 'Background color',
      control: {
        type: 'color',
        presetColors: [
          '#fe4a49',
          '#FED766',
          'rgba(0, 159, 183, 1)',
          'HSLA(240,11%,91%,0.5)',
          'slategray',
        ],
      },
    },
  },
  parameters: {
    chromatic: { disable: true },
    docs: {
      source: {
        state: 'open',
      },
    },
  },
};

const DEFAULT_NESTED_OBJECT = { a: 4, b: { c: 'hello', d: [1, 2, 3] } };

const Template = (args) => (
  <div style={args.background ? { background: args.background } : undefined}>
    <Button type={args.type}>
      {args.label?.type === 'b' ? <b>{args.children}</b> : args.children}
    </Button>
    {args.json && <pre>{JSON.stringify(args.json, null, 2)}</pre>}
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: 'basic',
  json: DEFAULT_NESTED_OBJECT,
};
Basic.parameters = { chromatic: { disable: false } };

export const Action = Template.bind({});
Action.args = {
  children: 'hmmm',
  type: 'action',
  json: null,
};

export const ImageFileControl = (args) => <img src={args.imageUrls[0]} alt="Your Example Story" />;
ImageFileControl.args = {
  imageUrls: ['http://place-hold.it/350x150'],
};

export const CustomControls = Template.bind({});
CustomControls.args = {
  children: 'hmmm',
  type: 'action',
  json: DEFAULT_NESTED_OBJECT,
};

CustomControls.argTypes = {
  children: { table: { disable: true } },
  type: { control: { disable: true } },
};

export const NoArgs = () => <Button>no args</Button>;

const hasCycle: any = {};
hasCycle.cycle = hasCycle;

export const CyclicArgs = Template.bind({});
CyclicArgs.args = {
  hasCycle,
};
CyclicArgs.parameters = {
  docs: { disable: true },
  chromatic: { disable: true },
};

export const CustomControlMatchers = Template.bind({});
CustomControlMatchers.parameters = {
  controls: {
    matchers: {
      date: /whateverIwant/,
    },
  },
};
CustomControlMatchers.args = {
  whateverIwant: '10/10/2020',
};

export const WithDisabledCustomControlMatchers = Template.bind({});
WithDisabledCustomControlMatchers.parameters = {
  controls: {
    matchers: {
      date: null,
      color: null,
    },
  },
};
WithDisabledCustomControlMatchers.args = {
  purchaseDate: '10/10/2020',
  backgroundColor: '#BADA55',
};

export const FilteredWithInclude = Template.bind({});
FilteredWithInclude.parameters = {
  controls: {
    include: ['Children'],
  },
};

export const FilteredWithIncludeRegex = Template.bind({});
FilteredWithIncludeRegex.args = {
  helloWorld: 1,
  helloPlanet: 1,
  byeWorld: 1,
};
FilteredWithIncludeRegex.parameters = {
  controls: {
    include: /hello*/,
  },
};

export const FilteredWithExclude = Template.bind({});
FilteredWithExclude.args = {
  helloWorld: 1,
  helloPlanet: 1,
  byeWorld: 1,
};
FilteredWithExclude.parameters = {
  controls: {
    exclude: ['helloPlanet', 'helloWorld'],
  },
};

export const FilteredWithExcludeRegex = Template.bind({});
FilteredWithExcludeRegex.args = {
  helloWorld: 1,
  helloPlanet: 1,
  byeWorld: 1,
};
FilteredWithExcludeRegex.parameters = {
  controls: {
    exclude: /hello*/,
  },
};
