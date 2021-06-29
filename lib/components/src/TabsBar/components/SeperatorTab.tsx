import React, { FC, useContext, useEffect } from 'react';
import { styled } from '@storybook/theming';
import { TabsBarContext } from '../TabsBarContext';
import { TabProps } from '../types';
import { getTabProps } from '../utils/get-tab-props';

export const SeperatorTab: FC<TabProps> = (props) => {
  const { addToMap, removeFromMap } = useContext(TabsBarContext);
  const tabProps = getTabProps(props);

  useEffect(() => {
    addToMap(tabProps);

    return () => {
      removeFromMap(tabProps);
    };
  }, []);

  return <Wrapper data-sb-tabs-seperator-tab="" {...props} />;
};

interface WrapperProps {
  textColor?: string;
}

const Wrapper = styled.span<WrapperProps>(({ theme, textColor }) => ({
  width: 1,
  height: 24,
  backgroundColor: textColor || theme.barTextColor,
  margin: '0 8px',
  opacity: 0.4,
}));
