import React, { FC, HTMLAttributes, useCallback, useContext, useEffect } from 'react';
import { TabsBarContext } from '../TabsBarContext';
import { TabProps } from '../types';
import { getTabProps } from '../utils/get-tab-props';
import { TabsButton } from '../TabsButton';

type ContentTabProps = TabProps & HTMLAttributes<HTMLButtonElement>;

export const ContentTab: FC<ContentTabProps> = (props) => {
  const { active, id, ...rest } = props;
  const tabProps = getTabProps(props);
  const { addToMap, removeFromMap, onSelect, selectedTabId } = useContext(TabsBarContext);

  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  useEffect(() => {
    addToMap(tabProps);

    return () => {
      removeFromMap(tabProps);
    };
  }, []);

  return (
    <TabsButton
      data-sb-tabs-content-tab=""
      id={id}
      active={active || selectedTabId === id}
      {...rest}
      onClick={handleClick}
    />
  );
};
