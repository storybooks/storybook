import { styled } from '@storybook/theming';
import React, { FC } from 'react';
import { TabsButton, TabsButtonProps } from './TabsButton';

export const TabsTool: FC<TabsButtonProps> = ({ ...rest }) => {
  return <Wrapper data-sb-tabs-tool="true" {...rest} />;
};

const Wrapper = styled(TabsButton)({
  padding: '0',
  '&:focus, &:active': {
    borderBottomColor: 'transparent',
  },
});
