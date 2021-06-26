import { useStorybookApi, useStorybookState } from '@storybook/api';
import { IconButton, Icons, TabButton, ScrollArea, Tabs } from '@storybook/components';
import { Location, Route } from '@storybook/router';
import { styled } from '@storybook/theming';
import global from 'global';
import React, { FunctionComponent, SyntheticEvent, Fragment } from 'react';

import { AboutPage } from './about_page';
import { ReleaseNotesPage } from './release_notes_page';
import { ShortcutsPage } from './shortcuts_page';
import { matchesModifiers, matchesKeyCode } from '../keybinding';

const { document } = global;

const TabBarButton = React.memo<{
  changeTab: (tab: string) => void;
  id: string;
  title: string;
}>(({ changeTab, id, title }) => (
  <Location>
    {({ path }) => {
      const active = path.includes(`settings/${id}`);
      return (
        <TabButton
          id={`tabbutton-${id}`}
          className={['tabbutton'].concat(active ? ['tabbutton-active'] : []).join(' ')}
          type="button"
          key="id"
          active={active}
          onClick={() => changeTab(id)}
          role="tab"
        >
          {title}
        </TabButton>
      );
    }}
  </Location>
));

const Content = styled(ScrollArea)(({ theme }) => ({
  top: 40,
  backgroundColor: theme.background.content,
}));

const Pages: FunctionComponent<{
  onClose: () => void;
  enableShortcuts?: boolean;
  hasReleaseNotes?: boolean;
  changeTab: (tab: string) => void;
}> = ({ changeTab, onClose, enableShortcuts = true, hasReleaseNotes = false }) => {
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!enableShortcuts || event.repeat) return;
      if (matchesModifiers(false, event) && matchesKeyCode('Escape', event)) {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <Fragment>
      <Tabs
        tools={
          <IconButton
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              return onClose();
            }}
            title="Close settings page"
          >
            <Icons icon="close" />
          </IconButton>
        }
      >
        <TabBarButton id="about" title="About" changeTab={changeTab} />
        {hasReleaseNotes && (
          <TabBarButton id="release-notes" title="Release notes" changeTab={changeTab} />
        )}
        <TabBarButton id="shortcuts" title="Keyboard shortcuts" changeTab={changeTab} />
      </Tabs>
      <Content vertical absolute>
        <Route path="about">
          <AboutPage key="about" />
        </Route>
        <Route path="release-notes">
          <ReleaseNotesPage key="release-notes" />
        </Route>
        <Route path="shortcuts">
          <ShortcutsPage key="shortcuts" />
        </Route>
      </Content>
    </Fragment>
  );
};

const SettingsPages: FunctionComponent = () => {
  const api = useStorybookApi();
  const state = useStorybookState();
  const changeTab = (tab: string) => api.changeSettingsTab(tab);

  return (
    <Pages
      hasReleaseNotes={!!api.releaseNotesVersion()}
      enableShortcuts={state.ui.enableShortcuts}
      changeTab={changeTab}
      onClose={api.closeSettings}
    />
  );
};

export { SettingsPages as default };
