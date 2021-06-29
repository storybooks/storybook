import { styled } from '@storybook/theming';
import React, { FC, useContext, useEffect } from 'react';
import { TabsBarContext } from '../TabsBarContext';
import { TabsTool as _TabsTool } from '../TabsTool';
import { TabProps } from '../types';
import { getTabProps } from '../utils/get-tab-props';

export const ToolTab: FC<TabProps> = (props) => {
  const { addToMap, removeFromMap } = useContext(TabsBarContext);
  const tabProps = getTabProps(props);

  useEffect(() => {
    addToMap(tabProps);

    return () => {
      removeFromMap(tabProps);
    };
  }, []);

  return <TabsTool data-sb-tabs-tool-tab="" {...props} />;
};

const TabsTool = styled(_TabsTool)({
  margin: '0 8px',
});
