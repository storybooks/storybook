import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { styled } from '@storybook/theming';
import { FlexBar } from '../bar/bar';
import { TabButton } from '../bar/button';
import { Placeholder } from '../placeholder/placeholder';
import { childrenToList, getChildIndexById } from './utils';

interface SelectedState {
  id: string;
  index: number;
}

interface OnChangeProps {
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>;
  previous: SelectedState;
  current: SelectedState;
}

interface OnSelectProps extends SelectedState {
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>;
}

export type TabsProps = {
  tools?: React.ReactNode;
  // @TODO - either add support for number also for gracefull compatibility with old version
  // or convert via new prop name - either way index support should be there rather than id based
  selected?: string;
  backgroundColor?: string;
  absolute?: boolean;
  bordered?: boolean;
  onSelect?: (state: OnSelectProps) => void;
  onChange?: (state: OnChangeProps) => void;
  /** @deprecated use normal on_ events directly on props */
  actions?: {
    /** @deprecated use onSelect directly on props */
    onSelect?: (id: string) => void;
  };
} & React.HTMLAttributes<HTMLDivElement>;

export const Tabs = forwardRef(
  (
    {
      actions,
      absolute,
      bordered,
      backgroundColor,
      selected: _selected,
      children,
      tools,
      onSelect,
      onChange,
      ...rest
    }: TabsProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const initialTabList = childrenToList(children, _selected);
    const initialSelectedIndex = getChildIndexById(_selected, initialTabList);
    const tabList = useRef(initialTabList);

    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [tabState, setTabState] = useState<SelectedState>({
      id: _selected,
      index: initialSelectedIndex || 0,
    });

    const pushActiveTab = useCallback(() => {
      const currentIndex = tabState.index;
      const currentIsLast = currentIndex + 1 === tabList.current.length;
      const index = currentIsLast ? 0 : currentIndex + 1;
      const { id } = tabList.current[index];

      setTabState({ ...tabState, id, index });
    }, [tabList, tabState, setTabState]);

    const pullActiveTab = useCallback(() => {
      const currentIsFirst = tabState.index === 0;
      const index = currentIsFirst ? tabList.current.length - 1 : tabState.index - 1;
      const { id } = tabList.current[index];

      setTabState({ ...tabState, id, index });
    }, [tabList, tabState, setTabState]);

    const setActiveTabToLast = useCallback(() => {
      const index = tabList.current.length - 1;
      const { id } = tabList.current[index];

      setTabState({ ...tabState, id, index });
    }, [tabList, tabState, setTabState]);

    const setActiveTabToFirst = useCallback(() => {
      const index = 0;
      const { id } = tabList.current[index];

      setTabState({ ...tabState, id, index });
    }, [tabList, tabState, setTabState]);

    useEffect(() => {
      if (_selected !== undefined && _selected !== tabState.id) {
        setTabState({ ...tabState, id: _selected });
      }
    }, [_selected, tabState, setTabState]);

    useEffect(() => {
      const newTabList = childrenToList(children, tabState.id);
      tabList.current = newTabList;
      setUpdateTrigger(updateTrigger + 1);
    }, [tabState, tabList]);

    // Since we have to use the ID as selected state control from outside both for initial
    // selected and later outside control we have to make a first update to provide default
    // setting first tab as active if prop is omitted (we need the right first id in the selected state)
    // This is to gracefully support support from the "old" Tabs component where id
    // is the controller to identify the selected tab and control state
    useEffect(() => {
      if (_selected === undefined && tabList.current.length > 0) {
        setTabState({
          ...tabState,
          id: tabList.current[0].id,
          index: 0,
        });
      }
    }, []);

    return tabList.current.length > 0 ? (
      <Wrapper absolute={absolute} bordered={bordered} {...rest} ref={ref}>
        <FlexBar border backgroundColor={backgroundColor}>
          <TabButtonBar role="tablist">
            {tabList.current.map(({ title, id, active, color }, index) => {
              const labelId = `${id}-label`;

              return (
                <TabButton
                  aria-selected={active ? 'true' : 'false'}
                  aria-labelledby={labelId}
                  role="tab"
                  id={id}
                  key={`${id}-tabbutton`}
                  className={`tabbutton ${active ? 'tabbutton-active' : ''}`}
                  active={active}
                  textColor={color}
                  onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
                    // Adding keyboard navigation support for tabs
                    // https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html
                    switch (event.key) {
                      case 'ArrowRight':
                        pushActiveTab();
                        break;
                      case 'ArrowLeft':
                        pullActiveTab();
                        break;
                      case 'End':
                        setActiveTabToLast();
                        break;
                      case 'Home':
                        setActiveTabToFirst();
                        break;
                      default:
                        break;
                    }
                  }}
                  onClick={(
                    event:
                      | React.MouseEvent<HTMLButtonElement>
                      | React.KeyboardEvent<HTMLButtonElement>
                  ) => {
                    event.preventDefault();

                    const previousSelected = { ...tabState };
                    const currentSelected = { ...tabState, id, index };

                    setTabState({ ...tabState, id, index });

                    // Deprecation support
                    if (actions && actions.onSelect) {
                      actions.onSelect(id);
                    }

                    if (onSelect) {
                      onSelect({ ...currentSelected, event });
                    }

                    if (onChange) {
                      onChange({ event, previous: previousSelected, current: currentSelected });
                    }
                  }}
                >
                  <span id={labelId}>{title}</span>
                </TabButton>
              );
            })}
          </TabButtonBar>
          {tools}
        </FlexBar>
        <TabContent bordered={bordered} absolute={absolute}>
          {tabList.current.map(({ active, content, id }) => (
            <div
              aria-hidden={active ? 'false' : 'true'}
              aria-labelledby={`${id}-label`}
              role="tabpanel"
              key={`${id}-tabpanel`}
              hidden={!active}
            >
              {content}
            </div>
          ))}
        </TabContent>
      </Wrapper>
    ) : (
      <Placeholder>
        <React.Fragment key="title">Nothing found</React.Fragment>
      </Placeholder>
    );
  }
);

export interface WrapperProps {
  bordered?: boolean;
  absolute?: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ theme, bordered }) =>
    bordered
      ? {
          backgroundClip: 'padding-box',
          border: `1px solid ${theme.appBorderColor}`,
          borderRadius: theme.appBorderRadius,
          overflow: 'hidden',
          boxSizing: 'border-box',
        }
      : {},
  ({ absolute }) =>
    absolute
      ? {
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }
      : {
          display: 'block',
        }
);

export const TabButtonBar = styled.div({
  overflow: 'hidden',

  '&:first-of-type': {
    marginLeft: 0,
  },
});

export type TabContentProps = {
  absolute?: boolean;
  bordered?: boolean;
};

const ignoreSsrWarning =
  '/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */';

const TabContent = styled.div<TabContentProps>(
  {
    display: 'block',
    position: 'relative',
  },
  ({ theme }) => ({
    fontSize: theme.typography.size.s2 - 1,
    background: theme.background.content,
  }),
  ({ bordered, theme }) =>
    bordered
      ? {
          borderRadius: `0 0 ${theme.appBorderRadius - 1}px ${theme.appBorderRadius - 1}px`,
        }
      : {},
  ({ absolute, bordered }) =>
    absolute
      ? {
          height: `calc(100% - ${bordered ? 42 : 40}px)`,

          position: 'absolute',
          left: 0 + (bordered ? 1 : 0),
          right: 0 + (bordered ? 1 : 0),
          bottom: 0 + (bordered ? 1 : 0),
          top: 40 + (bordered ? 1 : 0),
          overflow: 'auto',
          [`& > *:first-child${ignoreSsrWarning}`]: {
            position: 'absolute',
            left: 0 + (bordered ? 1 : 0),
            right: 0 + (bordered ? 1 : 0),
            bottom: 0 + (bordered ? 1 : 0),
            top: 0 + (bordered ? 1 : 0),
            height: `calc(100% - ${bordered ? 2 : 0}px)`,
            overflow: 'auto',
          },
        }
      : {}
);
