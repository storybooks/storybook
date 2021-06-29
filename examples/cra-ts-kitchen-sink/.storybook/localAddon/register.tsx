/* eslint-disable react/display-name */
import React from 'react';
import { addons, types } from '@storybook/addons';

const ID = 'local-addon';

const LocalAddonPanel = () => <>Local addon</>;

addons.register(ID, (api) =>
  addons.add(ID, {
    title: ID,
    type: types.PANEL,
    match: () => true,
    render: ({ active, key }) => (active ? <LocalAddonPanel key={key} /> : null),
  })
);
