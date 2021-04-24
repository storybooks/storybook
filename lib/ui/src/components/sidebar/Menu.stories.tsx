import React, { Fragment, FunctionComponent } from 'react';

import { WithTooltip, TooltipLinkList, Icons } from '@storybook/components';
import { styled } from '@storybook/theming';
import { MenuItemIcon, SidebarMenu, MenuButton, SidebarMenuList } from './Menu';
import { useMenu } from '../../containers/menu';

export default {
  component: MenuItemIcon,
  title: 'UI/Sidebar/Menu',
  decorators: [
    (StoryFn: FunctionComponent) => (
      <Fragment>
        <StoryFn />
      </Fragment>
    ),
  ],
};

const fakemenu = [
  { title: 'has icon', left: <MenuItemIcon icon="check" />, id: 'icon' },
  {
    title: 'has imgSrc',
    left: <MenuItemIcon imgSrc="https://via.placeholder.com/20" />,
    id: 'img',
  },
  { title: 'has neither', left: <MenuItemIcon />, id: 'non' },
];

export const Items = () => <TooltipLinkList links={fakemenu} />;

export const Real = () => <SidebarMenu menu={fakemenu} isHighlighted />;

const DoubleThemeRenderingHack = styled.div({
  '#storybook-root > [data-side="left"] > &': {
    textAlign: 'right',
  },
});

const ExpandedMenu: FunctionComponent<{ menu: any }> = ({ menu }) => (
  <DoubleThemeRenderingHack>
    <WithTooltip
      placement="top"
      trigger="click"
      closeOnClick
      startOpen
      tooltip={({ onHide }) => <SidebarMenuList onHide={onHide} menu={menu} />}
    >
      <MenuButton outline small containsIcon highlighted={false} title="Shortcuts">
        <Icons icon="ellipsis" />
      </MenuButton>
    </WithTooltip>
  </DoubleThemeRenderingHack>
);

export const Expanded = () => {
  const menu = useMenu(
    {
      // @ts-ignore
      getShortcutKeys: () => ({}),
      versionUpdateAvailable: () => false,
      releaseNotesVersion: () => '6.0.0',
    },
    false,
    false,
    false,
    false
  );
  return <ExpandedMenu menu={menu} />;
};

export const ExpandedWithoutReleaseNotes = () => {
  const menu = useMenu(
    {
      // @ts-ignore
      getShortcutKeys: () => ({}),
      versionUpdateAvailable: () => false,
      releaseNotesVersion: () => undefined,
    },
    false,
    false,
    false,
    false
  );
  return <ExpandedMenu menu={menu} />;
};
