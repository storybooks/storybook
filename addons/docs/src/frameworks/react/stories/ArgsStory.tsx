import React, { useState } from 'react';
import mapValues from 'lodash/mapValues';
// eslint-disable-next-line import/no-extraneous-dependencies
import { StoryContext } from '@storybook/react';
import { ArgsTable } from '@storybook/components';
import { Args } from '@storybook/api';
import { inferControls } from '@storybook/client-api';
import { useTheme, Theme } from '@storybook/theming';

import { extractArgTypes } from '../extractArgTypes';
import { Component } from '../../../blocks';

const argsTableProps = (component: Component) => {
  const argTypes = extractArgTypes(component);
  const parameters = { __isArgsStory: true, argTypes };
  const rows = inferControls(({ parameters } as unknown) as StoryContext);
  return { rows };
};

function FormatArg({ arg }: { arg: any }) {
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

export const ArgsStory = ({ component }: any) => {
  const { rows } = argsTableProps(component);
  const initialArgs = mapValues(rows, (argType) => argType.defaultValue) as Args;

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
