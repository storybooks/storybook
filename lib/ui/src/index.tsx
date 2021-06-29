import { Combo, Provider as ManagerProvider } from '@storybook/api';
import root from '@storybook/global-root';
import { History, Location, LocationProvider } from '@storybook/router';
import { ensure as ensureTheme, ThemeProvider } from '@storybook/theming';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import Provider from './provider';

const { DOCS_MODE } = root;

// @ts-ignore
ThemeProvider.displayName = 'ThemeProvider';
// @ts-ignore
HelmetProvider.displayName = 'HelmetProvider';

const getDocsMode = () => {
  try {
    return !!DOCS_MODE;
  } catch (e) {
    return false;
  }
};

const Container = process.env.XSTORYBOOK_EXAMPLE_APP ? React.StrictMode : React.Fragment;

export interface RootProps {
  provider: Provider;
  history?: History;
}

export const Root: FunctionComponent<RootProps> = ({ provider, history }) => (
  <Container key="container">
    <HelmetProvider key="helmet.Provider">
      <LocationProvider key="location.provider" history={history}>
        <Location key="location.consumer">
          {(locationData) => (
            <ManagerProvider
              key="manager"
              provider={provider}
              {...locationData}
              docsMode={getDocsMode()}
            >
              {({ state, api }: Combo) => {
                const panelCount = Object.keys(api.getPanels()).length;
                const story = api.getData(state.storyId, state.refId);
                const isLoading = story
                  ? !!state.refs[state.refId] && !state.refs[state.refId].ready
                  : !state.storiesFailed && !state.storiesConfigured;

                return (
                  <ThemeProvider key="theme.provider" theme={ensureTheme(state.theme)}>
                    <App
                      key="app"
                      viewMode={state.viewMode}
                      layout={isLoading ? { ...state.layout, showPanel: false } : state.layout}
                      panelCount={panelCount}
                      docsOnly={story && story.parameters && story.parameters.docsOnly}
                    />
                  </ThemeProvider>
                );
              }}
            </ManagerProvider>
          )}
        </Location>
      </LocationProvider>
    </HelmetProvider>
  </Container>
);

function renderStorybookUI(domNode: HTMLElement, provider: Provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  ReactDOM.render(<Root key="root" provider={provider} />, domNode);
}

export { Provider };
export { renderStorybookUI as default };
