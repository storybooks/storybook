import React, { Fragment } from 'react';
import { styled, withTheme, Theme } from '@storybook/theming';

import Inspector from 'react-inspector';
import { ActionBar, ScrollArea } from '@storybook/components';

import { Action, InspectorContainer, Counter } from './style';
import { ActionDisplay } from '../../models';

export const Wrapper = styled(({ children, className }: any) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))({
  margin: 0,
  padding: '10px 5px 20px',
});

interface InspectorProps {
  theme: Theme;
  sortObjectKeys: boolean;
  showNonenumerable: boolean;
  name: any;
  data: any;
}

const ThemedInspector = withTheme(({ theme, ...props }: InspectorProps) => (
  <Inspector theme={theme.addonActionsTheme || 'chromeLight'} {...props} />
));

interface ActionLoggerProps {
  actions: ActionDisplay[];
  onClear: () => void;
}

export const ActionLogger = ({ actions, onClear }: ActionLoggerProps) => (
  <Fragment>
    <Wrapper title="actionslogger">
      {actions.map((action: ActionDisplay) => (
        <Action key={action.id}>
          {action.count > 1 && <Counter>{action.count}</Counter>}
          <InspectorContainer>
            <ThemedInspector
              sortObjectKeys
              showNonenumerable={false}
              name={action.data.name}
              data={action.data.args || action.data}
            />
          </InspectorContainer>
        </Action>
      ))}
    </Wrapper>

    <ActionBar actionItems={[{ title: 'Clear', onClick: onClear }]} />
  </Fragment>
);
