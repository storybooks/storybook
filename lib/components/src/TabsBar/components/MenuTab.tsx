import { useDOMRect, useWindowSize } from '@storybook/addons';
import { styled } from '@storybook/theming';
import { useSelect } from 'downshift';
import React, { FC, HTMLAttributes, useCallback, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { document } from 'window-or-global';
import { Icons } from '../../icon/icon';
import { ScrollContext } from '../ScrollContext';
import { TabsBarContext } from '../TabsBarContext';
import { TabsButton as _TabsButton } from '../TabsButton';
import { TabMenu, TabProps } from '../types';
import { GetMenuItemById } from '../utils/get-menu-item-by-id';
import { getTabProps } from '../utils/get-tab-props';

const MENU_WIDTH = 200;

type MenuTabProps = {
  onMenuClose?: () => void;
  onMenuItemSelect?: (item: TabMenu) => void;
  onMenuOpen?: () => void;
} & TabProps &
  HTMLAttributes<HTMLButtonElement>;

export const MenuTab: FC<MenuTabProps> = (props) => {
  const {
    active,
    id,
    menu,
    onMenuClose,
    onMenuItemSelect,
    onMenuOpen,
    initial,
    selected,
    activeColor,
    ...rest
  } = props;
  const { addToMap, removeFromMap } = useContext(TabsBarContext);
  const offset = useContext(ScrollContext);
  const { width: windowsWidth } = useWindowSize();
  const {
    ref: rectRef,
    rect: { width, y, x, height },
  } = useDOMRect();

  useEffect(() => {
    const tabProps = getTabProps(props);
    addToMap(tabProps);

    return () => {
      removeFromMap(tabProps);
    };
  }, []);

  const handleMenuItemSelect = useCallback(
    ({ selectedItem }) => {
      if (onMenuItemSelect) {
        onMenuItemSelect(selectedItem);
      }
    },
    [onMenuItemSelect]
  );

  const handleMenuOpenChange = useCallback(
    (changes) => {
      if (changes.isOpen && onMenuOpen) {
        onMenuOpen();
      } else if (!changes.isOpen && onMenuClose) {
        onMenuClose();
      }
    },
    [onMenuClose, onMenuOpen]
  );

  const {
    highlightedIndex,
    isOpen,
    selectedItem,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    closeMenu,
  } = useSelect({
    items: menu,
    initialSelectedItem: GetMenuItemById(initial, menu),
    onSelectedItemChange: handleMenuItemSelect,
    onIsOpenChange: handleMenuOpenChange,
  });

  const maxLeft = windowsWidth - MENU_WIDTH;
  const minLeft = 0;
  let menuLeft = x - (MENU_WIDTH - width) / 2 - offset;

  if (menuLeft > maxLeft) {
    menuLeft = maxLeft;
  } else if (menuLeft < minLeft) {
    menuLeft = minLeft;
  }

  const allowMenu = x + width - offset <= windowsWidth && x - offset >= 0;

  useEffect(() => {
    if (!allowMenu) {
      closeMenu();
    }
  }, [allowMenu]);

  return (
    <div ref={rectRef}>
      <TabsButton
        data-sb-tabs-menu-tab=""
        active={isOpen}
        activeColor={activeColor}
        narrow
        adornmentEnd={
          <Expander isOpen={isOpen}>
            <ExpanderIcon icon="chevrondown" />
          </Expander>
        }
        {...rest}
        {...getToggleButtonProps()}
      />
      {createPortal(
        <>
          <List
            data-sb-tabs-menu=""
            isOpen={isOpen}
            style={{
              left: menuLeft,
              top: y + height + 10,
              width: MENU_WIDTH,
            }}
            {...getMenuProps()}
          >
            {menu.length > 0 &&
              menu.map((item, index) => {
                const iconPosition = item.iconPosition || 'left';
                return (
                  <ListItem
                    data-sb-tabs-menu-item=""
                    selected={selectedItem && selectedItem.id && selectedItem.id === item.id}
                    highlighted={highlightedIndex === index}
                    key={item.id}
                    activeColor={activeColor}
                    {...getItemProps({ item, index })}
                  >
                    <ListItemInner>
                      {item.left !== undefined && <Left>{item.left}</Left>}
                      {item.icon !== undefined && iconPosition === 'left' && (
                        <IconLeft icon={item.icon} />
                      )}
                      {Icon !== undefined && iconPosition === 'left' && item.Icon}
                      <Label>{item.label}</Label>
                      <Center>{item.center}</Center>
                      {Icon !== undefined && iconPosition === 'right' && item.Icon}
                      {item.icon !== undefined && iconPosition === 'right' && (
                        <IconRight icon={item.icon} />
                      )}
                      {item.right !== undefined && <Right>{item.right}</Right>}
                    </ListItemInner>
                  </ListItem>
                );
              })}
          </List>
        </>,
        document.getElementsByTagName('body')[0]
      )}
    </div>
  );
};

const TabsButton = styled(_TabsButton)({
  margin: '0 8px',
});

type ListProps = {
  isOpen: boolean;
};

const List = styled.ul<ListProps>(({ theme, isOpen }) => ({
  // borderTop: `3px solid ${theme.color.secondary}`,
  overflow: 'hidden',
  backgroundColor: theme.background.content,
  borderRadius: theme.appBorderRadius,
  filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.05)) drop-shadow(0 1px 3px rgba(0,0,0,0.1))',
  listStyle: 'none',
  margin: 0,
  maxHeight: 'calc(70vh - 40px)',
  opacity: isOpen ? 1 : 0,
  outline: '0 none',
  padding: 0,
  visibility: isOpen ? 'visible' : 'hidden',
  position: 'absolute',
  transform: `translateY(${isOpen ? '0px' : '6px'})`,
  transformOrigin: 'center',
  transition: `transform ${isOpen ? '250ms' : '175ms'} ease-in-out, opacity 250ms ease-in-out`,
}));

interface ExpanderProps {
  isOpen: boolean;
}

const Expander = styled.div<ExpanderProps>(
  {
    height: 8,
    width: 8,
    marginLeft: 6,
    transition: 'transform 120ms ease-in-out',
  },
  ({ isOpen }) => ({
    transform: `rotate(${isOpen ? 180 : 0}deg)`,
  })
);

const ExpanderIcon = styled(Icons)({
  height: 8,
  width: 8,
});

interface ListItemProps {
  selected: boolean;
  highlighted: boolean;
  activeColor: string;
}

const ListItem = styled.li<ListItemProps>(({ theme, selected, highlighted, activeColor }) => ({
  backgroundColor: selected || highlighted ? theme.color.secondary : 'transparent',
  color: selected || highlighted ? theme.color.inverseText : theme.color.defaultText,
  overflow: 'hidden',
  cursor: 'pointer',
  outline: '0 none',
  '&:hover': {
    backgroundColor:
      selected || highlighted ? activeColor || theme.barSelectedColor : theme.background.hoverable,
  },
  '&:active,&:focus': {
    backgroundColor: activeColor || theme.barSelectedColor,
    color: theme.color.inverseText,
  },
}));

const ListItemInner = styled.div({
  alignItems: 'center;',
  display: 'flex',
  height: 36,
  justifyContent: 'space-between',
  padding: '0 12px',
  width: '100%',
});

const Content = styled.div({
  alignItems: 'center',
  display: 'flex',
  fontSize: 10,
  minWidth: 14,
  justifyContent: 'center',
});

const Left = styled(Content)({
  marginRight: 8,
});

const Label = styled(Content)({
  fontSize: 12,
});

const Center = styled(Content)({
  flexGrow: 1,
  justifyContent: 'center',
});

const Right = styled(Content)({
  marginLeft: 8,
});

const Icon = styled(Icons)(({ theme }) => ({
  height: 13,
  width: 13,
  color: theme.color.defaultText,
  opacity: 0.96,
}));

const IconLeft = styled(Icon)({ marginRight: 8 });

const IconRight = styled(Icon)({ marginLeft: 8 });
