import React from 'react';
import { addons, types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { A11yVisionSimulator } from './containers/A11yVisionSimulator';
import { A11yAddonPanel } from './containers/A11yAddonPanel';
import { A11yContextProvider } from './A11yContext';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: '',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <A11yVisionSimulator />,
  });

  addons.add(PANEL_ID, {
    title: 'Accessibility',
    type: types.PANEL,
    render: ({ active = true, key }) => (
      <A11yContextProvider key={key} active={active}>
        <A11yAddonPanel />
      </A11yContextProvider>
    ),
    paramKey: PARAM_KEY,
  });
});
