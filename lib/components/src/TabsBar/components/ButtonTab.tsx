import { styled } from '@storybook/theming';
import React, { FC, HTMLAttributes, useContext, useEffect } from 'react';
import { TabsBarContext } from '../TabsBarContext';
import { TabsButton as _TabsButton } from '../TabsButton';
import { TabProps } from '../types';
import { getTabProps } from '../utils/get-tab-props';

type ButtonTabProps = TabProps & HTMLAttributes<HTMLButtonElement>;

export const ButtonTab: FC<ButtonTabProps> = (props) => {
  const { addToMap, removeFromMap } = useContext(TabsBarContext);
  const tabProps = getTabProps(props);

  useEffect(() => {
    addToMap(tabProps);

    return () => {
      removeFromMap(tabProps);
    };
  }, []);

  return <TabsButton data-sb-tabs-button-tab="" narrow {...props} />;
};

const TabsButton = styled(_TabsButton)({
  margin: '0 8px',
});
