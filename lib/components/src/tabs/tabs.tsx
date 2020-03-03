import React, {
  Children,
  Component,
  Fragment,
  FunctionComponent,
  memo,
  MouseEvent,
  ReactNode,
} from 'react';
import { styled } from '@storybook/theming';

import { Placeholder } from '../placeholder/placeholder';
import { FlexBar } from '../bar/bar';
import { TabButton } from '../bar/button';

const ignoreSsrWarning =
  '/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */';

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

export const TabBar = styled.div({
  overflow: 'hidden',

  '&:first-of-type': {
    marginLeft: 0,
  },
});

export interface ContentProps {
  absolute?: boolean;
}

const Content = styled.div<ContentProps>(
  {
    display: 'block',
    position: 'relative',
  },
  ({ theme }) => ({
    fontSize: theme.typography.size.s2 - 1,
  }),
  ({ absolute }) =>
    absolute
      ? {
          height: 'calc(100% - 40px)',

          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 40,
          overflow: 'auto',
          [`& > *:first-child${ignoreSsrWarning}`]: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            height: '100%',
            overflow: 'auto',
          },
        }
      : {}
);

export interface VisuallyHiddenProps {
  active?: boolean;
}

const VisuallyHidden = styled.div<VisuallyHiddenProps>(({ active }) =>
  active ? { display: 'block' } : { display: 'none' }
);

export interface TabWrapperProps {
  active: boolean;
  render?: () => JSX.Element;
  children?: ReactNode;
}

export const TabWrapper: FunctionComponent<TabWrapperProps> = ({ active, render, children }) => (
  <VisuallyHidden active={active}>{render ? render() : children}</VisuallyHidden>
);

export const panelProps = {};

const childrenToList = (children: any, selected: string) =>
  Children.toArray(children).map(
    ({ props: { title, id, color, children: childrenOfChild } }: React.ReactElement, index) => {
      const content = Array.isArray(childrenOfChild) ? childrenOfChild[0] : childrenOfChild;
      return {
        active: selected ? id === selected : index === 0,
        title,
        id,
        color,
        render:
          typeof content === 'function'
            ? content
            : ({ active, key }: any) => (
                <VisuallyHidden key={key} active={active} role="tabpanel">
                  {content}
                </VisuallyHidden>
              ),
      };
    }
  );

export interface TabsProps {
  id?: string;
  tools?: ReactNode;
  selected?: string;
  actions?: {
    onSelect: (id: string) => void;
  } & Record<string, any>;
  backgroundColor?: string;
  absolute?: boolean;
  bordered?: boolean;
}

export const Tabs: FunctionComponent<TabsProps> = memo(
  ({ children, selected, actions, absolute, bordered, tools, backgroundColor, id: htmlId }) => {
    const list = childrenToList(children, selected);

    return list.length ? (
      <Wrapper absolute={absolute} bordered={bordered} id={htmlId}>
        <FlexBar border backgroundColor={backgroundColor}>
          <TabBar role="tablist">
            {list.map(({ title, id, active, color }) => (
              <TabButton
                type="button"
                key={id}
                active={active}
                textColor={color}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  actions.onSelect(id);
                }}
                role="tab"
                className={`tabbutton ${active ? 'tabbutton-active' : ''}`}
              >
                {typeof title === 'function' ? title() : title}
              </TabButton>
            ))}
          </TabBar>
          {tools ? <Fragment>{tools}</Fragment> : null}
        </FlexBar>
        <Content absolute={absolute}>
          {list.map(({ id, active, render }) => render({ key: id, active }))}
        </Content>
      </Wrapper>
    ) : (
      <Placeholder>
        <Fragment key="title">Nothing found</Fragment>
      </Placeholder>
    );
  }
);
Tabs.displayName = 'Tabs';
(Tabs as any).defaultProps = {
  id: null,
  children: null,
  tools: null,
  selected: null,
  absolute: false,
  bordered: false,
};

type FuncChilden = () => void;

export interface TabsStateProps {
  children: (ReactNode | FuncChilden)[];
  initial: string;
  absolute: boolean;
  bordered: boolean;
  backgroundColor: string;
}

export interface TabsStateState {
  selected: string;
}

export class TabsState extends Component<TabsStateProps, TabsStateState> {
  static defaultProps: TabsStateProps = {
    children: [],
    initial: null,
    absolute: false,
    bordered: false,
    backgroundColor: '',
  };

  constructor(props: TabsStateProps) {
    super(props);

    this.state = {
      selected: props.initial,
    };
  }

  handlers = {
    onSelect: (id: string) => this.setState({ selected: id }),
  };

  render() {
    const { bordered = false, absolute = false, children, backgroundColor } = this.props;
    const { selected } = this.state;
    return (
      <Tabs
        bordered={bordered}
        absolute={absolute}
        selected={selected}
        backgroundColor={backgroundColor}
        actions={this.handlers}
      >
        {children}
      </Tabs>
    );
  }
}
