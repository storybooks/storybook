import React, { useState } from 'react';
import { storiesOf, StoryContext } from '@storybook/react';
import { ArgsTable } from '@storybook/components';
import { Args } from '@storybook/api';
import { inferControls } from '@storybook/client-api';
import { useTheme, Theme } from '@storybook/theming';

import { extractArgTypes } from './extractArgTypes';
import { Component } from '../../blocks';

const argsTableProps = (component: Component) => {
  const argTypes = extractArgTypes(component);
  const parameters = { __isArgsStory: true, argTypes };
  const rows = inferControls(({ parameters } as unknown) as StoryContext);
  return { rows };
};

function FormatArg({ arg }) {
  const theme = useTheme<Theme>();
  const badgeStyle = {
    background: theme.background.hoverable,
    border: `1px solid ${theme.background.hoverable}`,
    borderRadius: 2,
  };
  if (typeof arg !== 'undefined') {
    try {
      return <code>{JSON.stringify(arg, null, 2)}</code>;
    } catch (err) {
      return <code style={badgeStyle}>{arg.toString()}</code>;
    }
  }
  return <code style={badgeStyle}>undefined</code>;
}

const ArgsStory = ({ component }: any) => {
  const { rows } = argsTableProps(component);
  const initialArgs = Object.entries(rows).reduce<Args>((acc, [key, argType]) => {
    acc[key] = argType.defaultValue;
    return acc;
  }, {});

  const [args, setArgs] = useState(initialArgs);
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>key</th>
            <th>val</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(args).map(([key, val]) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <FormatArg arg={val} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ArgsTable rows={rows} args={args} updateArgs={(val) => setArgs({ ...args, ...val })} />
    </>
  );
};

const typescriptFixtures = [
  'aliases',
  'arrays',
  'enums',
  'functions',
  'interfaces',
  'intersections',
  'records',
  'scalars',
  'tuples',
  'unions',
  'optionals',
];

const typescriptStories = storiesOf('ArgTypes/TypeScript', module);
typescriptFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require, no-shadow
  const { Component } = require(`../../lib/convert/__testfixtures__/typescript/${fixture}`);
  typescriptStories.add(fixture, () => <ArgsStory component={Component} />);
});

const proptypesFixtures = ['arrays', 'enums', 'misc', 'objects', 'react', 'scalars'];

const proptypesStories = storiesOf('ArgTypes/PropTypes', module);
proptypesFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require, no-shadow
  const { Component } = require(`../../lib/convert/__testfixtures__/proptypes/${fixture}`);
  proptypesStories.add(fixture, () => <ArgsStory component={Component} />);
});

const issuesFixtures = [
  'js-class-component',
  'js-function-component',
  'js-function-component-inline-defaults',
  'js-function-component-inline-defaults-no-propTypes',
  'ts-function-component',
  'ts-function-component-inline-defaults',
  '9399-js-proptypes-shape',
  '8663-js-styled-components',
  '9626-js-default-values',
  '9668-js-proptypes-no-jsdoc',
  '8143-ts-react-fc-generics',
  '8143-ts-imported-types',
  '8279-js-styled-docgen',
  '8140-js-prop-types-oneof',
  '9023-js-hoc',
  '8740-ts-multi-props',
  '9556-ts-react-default-exports',
  '9592-ts-styled-props',
  '9591-ts-import-types',
  '9721-ts-deprecated-jsdoc',
  '9827-ts-default-values',
  '9586-js-react-memo',
  '9575-ts-camel-case',
  '9493-ts-display-name',
  '8894-9511-ts-forward-ref',
  '9465-ts-type-props',
  '8428-js-static-prop-types',
  '9764-ts-extend-props',
  '9922-ts-component-props',
];

const issuesStories = storiesOf('ArgTypes/Issues', module);
issuesFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { component } = require(`./__testfixtures__/${fixture}/input`);

  issuesStories.add(fixture, () => <ArgsStory component={component} />);
});
