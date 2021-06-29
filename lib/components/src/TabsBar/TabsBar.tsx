import { styled } from '@storybook/theming';
import { nanoid } from 'nanoid';
import React, {
  Children,
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ScrollArea } from '../ScrollArea/ScrollArea';
import { ScrollAreaProps } from '../ScrollArea/types';
import { ButtonTab } from './components/ButtonTab';
import { ContentTab } from './components/ContentTab';
import { MenuTab } from './components/MenuTab';
import { SeperatorTab } from './components/SeperatorTab';
import { ToolTab } from './components/ToolTab';
import { ScrollContext } from './ScrollContext';
import { AddToMapFn, RemoveFromMapFn, TabsBarContext } from './TabsBarContext';
import { TabMenu, TabProps } from './types';

type TabMapItem = { index: number; props: TabProps };

type TabMap = Record<string, TabMapItem>;

export type TabsBarProps = {
  absolute?: boolean;
  tabs?: TabProps[];
  tools?: ReactNode;
  staticTools?: boolean;
  selected?: string;
  initial?: string;
  bordered?: boolean;
  textColor?: string;
  backgroundColor?: string;
  rounded?: boolean;
  activeColor?: string;
  onMenuClose?: () => void;
  onMenuItemSelect?: (item: TabMenu) => void;
  onMenuOpen?: () => void;
} & HTMLAttributes<HTMLDivElement>;

export const TabsBar: FC<TabsBarProps> = ({
  absolute,
  children,
  tabs = [],
  tools,
  selected,
  bordered,
  initial,
  staticTools,
  backgroundColor,
  textColor,
  activeColor,
  rounded,
  onMenuClose,
  onMenuItemSelect,
  onMenuOpen,
  ...rest
}) => {
  const [contentItems, setContentItems] = useState<TabProps[]>([]);
  const [tabItems, setTabItems] = useState<ReactNode[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedTabId, setSelectedTabId] = useState(selected);
  const tabsMap = useRef<TabMap>({});
  const tabsMapIndexRef = useRef(0);
  const tabItemsLength = children ? Children.count(children) : tabs.length;
  const idRef = useRef(nanoid());

  const addToMap: AddToMapFn = useCallback(
    (tab) => {
      const index = tabsMapIndexRef.current + 1;
      tabsMap.current = { ...tabsMap.current, [tab.id]: { index, props: tab } };
      tabsMapIndexRef.current = index;

      if (tabsMapIndexRef.current === tabItemsLength) {
        const newContentItems = Object.keys(tabsMap.current)
          .map((key) => tabsMap.current[key].props)
          .filter((props) => props.type === 'content')
          .map((props) => props);

        let firstId = '';
        Object.keys(tabsMap.current)
          .map((i) => tabsMap.current[i])
          .some((tabItem) => {
            const hit = tabItem.props.type === 'content' && tabItem.props.content;
            firstId = hit ? tabItem.props.id : '';
            return hit;
          });

        if (!initial && !selected) {
          setSelectedTabId(firstId);
        }

        setContentItems(newContentItems);
      }
    },
    [tabsMap, tabsMapIndexRef]
  );

  const removeFromMap: RemoveFromMapFn = useCallback(
    (tab) => {
      const newTabsMap = { ...tabsMap.current };
      delete newTabsMap[tab.id];

      tabsMapIndexRef.current -= 1;
      tabsMap.current = newTabsMap;
    },
    [tabsMap, tabsMapIndexRef]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedTabId(id);
    },
    [setSelectedTabId]
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollLeft } = event.currentTarget;
      setScrollOffset(scrollLeft);
    },
    [scrollOffset, setScrollOffset]
  );

  useEffect(() => {
    if (tabs.length > 0 && !children) {
      setTabItems(
        tabs.map((_props) => {
          const props = { ..._props, type: _props.type || 'content' };
          const id = `${idRef.current}-${props.id}`;
          let Tab: ReactNode;

          switch (props.type) {
            case 'content':
              Tab = (
                <ContentTab
                  key={`tab-${props.id}`}
                  textColor={textColor}
                  activeColor={activeColor}
                  {...props}
                  id={id}
                />
              );
              break;
            case 'button':
              Tab = (
                <ButtonTab
                  key={`tab-${props.id}`}
                  textColor={textColor}
                  activeColor={activeColor}
                  {...props}
                  id={id}
                />
              );
              break;
            case 'seperator':
              Tab = (
                <SeperatorTab
                  key={`tab-${props.id}`}
                  textColor={textColor}
                  activeColor={activeColor}
                  {...props}
                  id={id}
                />
              );
              break;
            case 'tool':
              Tab = (
                <ToolTab
                  key={`tab-${props.id}`}
                  textColor={textColor}
                  activeColor={activeColor}
                  {...props}
                  id={id}
                />
              );
              break;
            case 'menu':
              Tab = (
                <MenuTab
                  key={`tab-${props.id}`}
                  onMenuClose={onMenuClose}
                  onMenuOpen={onMenuOpen}
                  onMenuItemSelect={onMenuItemSelect}
                  textColor={textColor}
                  activeColor={activeColor}
                  {...props}
                  id={id}
                />
              );
              break;
            default:
              break;
          }

          return Tab;
        })
      );
    }
  }, [children, tabs]);

  useEffect(() => {
    setSelectedTabId(selected);
  }, [selected]);

  useEffect(() => {
    setSelectedTabId(initial);
  }, [initial]);

  const scrollAreaProps: ScrollAreaProps = {
    style: { width: '100%' },
    onScroll: handleScroll,
  };

  return (
    <TabsBarContext.Provider
      value={{ addToMap, removeFromMap, onSelect: handleSelect, selectedTabId }}
    >
      <ScrollContext.Provider value={scrollOffset}>
        <Wrapper
          data-sb-tabs-bar=""
          absolute={absolute}
          bordered={bordered}
          rounded={rounded}
          staticTools={staticTools}
          {...rest}
        >
          {staticTools ? (
            <StaticTabsArea
              data-sb-tabs-bar-tabarea=""
              backgroundColor={backgroundColor}
              textColor={textColor}
            >
              <ScrollArea data-sb-tabs-bar-tabsscrollarea="" {...scrollAreaProps}>
                <Tabs data-sb-tabs-bar-tabs="">{children || tabItems}</Tabs>
              </ScrollArea>
              <Tools data-sb-tabs-bar-tools="">{tools}</Tools>
            </StaticTabsArea>
          ) : (
            <ScrollArea data-sb-tabs-bar-scrollarea="" {...scrollAreaProps}>
              <ScrollAreaInner
                data-sb-tabs-bar-scrollarea-inner=""
                backgroundColor={backgroundColor}
                textColor={textColor}
              >
                <Tabs data-sb-tabs-bar-tabs="">{children || tabItems}</Tabs>
                <Tools data-sb-tabs-bar-tools="">{tools}</Tools>
              </ScrollAreaInner>
            </ScrollArea>
          )}
          <ContentArea
            data-sb-contentarea=""
            bordered={contentItems.length > 0 && selectedTabId !== undefined}
          >
            {contentItems.map(({ id, content }) => {
              return (
                <div key={`content-${id}`} hidden={id !== selectedTabId}>
                  {content instanceof Function ? content() : content}
                </div>
              );
            })}
          </ContentArea>
        </Wrapper>
      </ScrollContext.Provider>
    </TabsBarContext.Provider>
  );
};

interface WrapperProps {
  absolute: boolean;
  bordered: boolean;
  rounded: boolean;
  staticTools: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ bordered, theme, rounded }) => ({
    border: bordered ? `1px solid ${theme.color.border}` : '0 none',
    borderRadius: rounded ? theme.appBorderRadius : '0',
  }),
  ({ absolute }) =>
    absolute && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
);

interface ScrollableBarBaseProps {
  backgroundColor: string;
  textColor: string;
}

const ScrollableBarBase = styled.div<ScrollableBarBaseProps>(
  ({ backgroundColor, textColor, theme }) => ({
    backgroundColor: backgroundColor || theme.background.bar,
    color: textColor || theme.barTextColor,
  })
);

const ScrollAreaInner = styled(ScrollableBarBase)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StaticTabsArea = styled(ScrollableBarBase)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '& [data-sb-tabs-bar-tools]': {
    justifySelf: 'flex-end',
  },
});

const Tabs = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Tools = styled.div({
  display: 'flex',
  paddingRight: 16,
  paddingLeft: 16,

  '& > *': {
    marginRight: 16,
    '&:last-child': {
      marginRight: 0,
    },
  },
});

interface ContentAreaProps {
  bordered: boolean;
}

const ContentArea = styled.div<ContentAreaProps>(({ bordered, theme }) => ({
  borderTop: bordered ? `1px solid ${theme.color.border}` : '0 none',
}));
