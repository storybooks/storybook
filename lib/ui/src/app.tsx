import { useDOMRect } from '@storybook/addons';
import { State } from '@storybook/api';
import { Symbols } from '@storybook/components';
import { Route } from '@storybook/router';
import { createGlobal, Global, styled } from '@storybook/theming';
import React, { FC, FunctionComponent, ReactNode, useMemo, useRef } from 'react';
import { Desktop } from './components/layout/desktop';
import { Mobile } from './components/layout/mobile';
import Notifications from './containers/notifications';
import Panel from './containers/panel';
import Preview from './containers/preview';
import Sidebar from './containers/sidebar';
import SettingsPages from './settings';

export interface AppProps {
  viewMode: State['viewMode'];
  docsOnly: boolean;
  layout: State['layout'];
  panelCount: number;
}

const App: FC<AppProps> = ({ viewMode, docsOnly, layout, panelCount }) => {
  const {
    ref: viewRef,
    rect: { width, height },
  } = useDOMRect({ live: true });

  const props = useMemo(
    () => ({
      Sidebar,
      Preview,
      Panel,
      Notifications,
      pages: [
        {
          key: 'settings',
          render: () => <SettingsPages />,
          route: (({ children }) => (
            <Route path="/settings" startsWith>
              {children}
            </Route>
          )) as FunctionComponent,
        },
      ],
    }),
    []
  );

  let Content: ReactNode;

  if (width < 600) {
    Content = <Mobile {...props} viewMode={viewMode} options={layout} docsOnly={docsOnly} />;
  } else {
    Content = (
      <Desktop
        {...props}
        viewMode={viewMode}
        options={layout}
        docsOnly={docsOnly}
        {...{ width, height }}
        panelCount={panelCount}
      />
    );
  }

  return (
    <View ref={viewRef}>
      <Global styles={createGlobal} />
      <Symbols icons={['folder', 'component', 'document', 'bookmarkhollow']} />
      {Content}
    </View>
  );
};

const View = styled.div({
  position: 'fixed',
  overflow: 'hidden',
  height: '100vh',
  width: '100vw',
});

App.displayName = 'App';

export default App;
