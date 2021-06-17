import * as React from 'react';
import addons from '@storybook/addons';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './shared';

import Panel from './components/Panel';

addons.register(ADDON_ID, () => {
  addons.addPanel(PANEL_ID, {
    title: 'Bundle Analyzer',
    render: ({ active, key }) => <Panel key={key} active={active} />,
    paramKey: PARAM_KEY,
  });
});
