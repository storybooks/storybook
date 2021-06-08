import React, { FC } from 'react';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton, WithTooltip, TooltipLinkList, TabButton } from '@storybook/components';
import { NormalizedToolbarArgType } from '../types';

export type MenuToolbarProps = NormalizedToolbarArgType & {
  id: string;
};

export const MenuToolbar: FC<MenuToolbarProps> = ({
  id,
  name,
  description,
  toolbar: { icon, items, showName },
}) => {
  const [globals, updateGlobals] = useGlobals();
  const selectedValue = globals[id];
  const active = selectedValue != null;
  const selectedItem = active && items.find((item) => item.value === selectedValue);
  const selectedIcon = (selectedItem && selectedItem.icon) || icon;

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }) => {
        const links = items.map((item) => {
          const { value, left, title, right } = item;
          return {
            id: value,
            left,
            title,
            right,
            active: selectedValue === value,
            onClick: () => {
              updateGlobals({ [id]: value });
              onHide();
            },
          };
        });
        return <TooltipLinkList links={links} />;
      }}
      closeOnClick
    >
      {selectedIcon ? (
        <IconButton key={name} active={active} title={description}>
          <Icons icon={selectedIcon} />
          {showName ? `\xa0${name}` : null}
        </IconButton>
      ) : (
        <TabButton active={active}>{name}</TabButton>
      )}
    </WithTooltip>
  );
};
