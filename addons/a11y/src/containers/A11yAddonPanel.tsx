import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { styled } from '@storybook/theming';
import { ActionBar, Icons, ScrollArea } from '@storybook/components';
import { useChannel, useParameter, useStorybookState } from '@storybook/api';
import { PanelTabs } from '../components/PanelTabs';
import { useA11yContext } from '../A11yContext';
import { EVENTS } from '../constants';

/* eslint-disable import/order */
import { AxeResults } from 'axe-core';
import type { A11yParameters } from '../params';

type ManualParam = Pick<A11yParameters, 'manual'>;

type Status = 'initial' | 'manual' | 'running' | 'error' | 'ran' | 'ready';

export const A11yAddonPanel = () => {
  const { manual } = useParameter<ManualParam>('a11y', { manual: false });
  const [status, setStatus] = useState<Status>(manual ? 'manual' : 'initial');
  const [error, setError] = React.useState<unknown>(undefined);
  const { setResults, results } = useA11yContext();
  const { storyId } = useStorybookState();

  const handleResult = (axeResults: AxeResults) => {
    setStatus('ran');
    setResults(axeResults);

    setTimeout(() => {
      if (status === 'ran') {
        setStatus('ready');
      }
    }, 900);
  };

  const handleRun = useCallback(() => {
    setStatus('running');
  }, []);

  const handleError = useCallback((err: unknown) => {
    setStatus('error');
    setError(err);
  }, []);

  const emit = useChannel({
    [EVENTS.RUNNING]: handleRun,
    [EVENTS.RESULT]: handleResult,
    [EVENTS.ERROR]: handleError,
  });

  const handleManual = useCallback(() => {
    setStatus('running');
    emit(EVENTS.MANUAL, storyId);
  }, [storyId]);

  const manualActionItems = useMemo(() => [{ title: 'Run test', onClick: handleManual }], [
    handleManual,
  ]);

  const readyActionItems = useMemo(
    () => [
      {
        title:
          status === 'ready' ? (
            'Rerun tests'
          ) : (
            <>
              <Icon icon="check" /> Tests completed
            </>
          ),
        onClick: handleManual,
      },
    ],
    [status, handleManual]
  );

  useEffect(() => {
    setStatus(manual ? 'manual' : 'initial');
  }, [manual]);

  return (
    <>
      {status === 'initial' && <Centered>Initializing...</Centered>}
      {status === 'manual' && (
        <>
          <Centered>Manually run the accessibility scan.</Centered>
          <ActionBar key="actionbar" actionItems={manualActionItems} />
        </>
      )}
      {status === 'running' && (
        <Centered>
          <RotatingIcon icon="sync" /> Please wait while the accessibility scan is running ...
        </Centered>
      )}
      {/** This is the presentation of reports with tabs for violations, passes and incomplete */}
      {(status === 'ready' || status === 'ran') && (
        <>
          <ScrollArea vertical horizontal>
            <PanelTabs key="tabs" results={results} />
          </ScrollArea>
          <ActionBar key="actionbar" actionItems={readyActionItems} />
        </>
      )}
      {status === 'error' && (
        <Centered>
          The accessibility scan encountered an error.
          <br />
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Centered>
      )}
    </>
  );
};

const Icon = styled(Icons)({
  height: 12,
  width: 12,
  marginRight: 4,
});

const RotatingIcon = styled(Icon)<{}>(({ theme }) => ({
  animation: `${theme.animation.rotate360} 1s linear infinite;`,
}));

const Centered = styled.span<{}>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});
