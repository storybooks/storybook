import React, { useCallback, useRef } from 'react';
import { uniqueId } from 'lodash';
import { useTheme } from '@storybook/theming';
import { FFTabs, FFTabItem } from '@storybook/components';
import { GlobalHighlight } from './GlobalHighlight';
import { Report } from './Report';
import { useA11yContext, RuleType } from '../A11yContext';
import { ADDON_ID } from '../constants';

/* eslint-disable import/order */
import type { Theme } from '@storybook/theming';
import type { Results } from '../A11yContext';

interface AddonPanelTabsProps {
  results: Results;
}

export const PanelTabs = ({ results }: AddonPanelTabsProps) => {
  const idRef = useRef(uniqueId(`${ADDON_ID}-panel-tabs`));
  const { tab, setTab } = useA11yContext();
  const theme = useTheme<Theme>();

  if (results === null) {
    return null;
  }

  const highlightToggleId = `${RuleType[tab]}-global-checkbox`;
  const highlightLabel = `Highlight results`;

  const handleOnSelect = useCallback(
    ({ index }) => {
      setTab(index);
    },
    [setTab]
  );

  const resultsMap = {
    [RuleType.VIOLATION]: results.violations,
    [RuleType.PASS]: results.passes,
    [RuleType.INCOMPLETION]: results.incomplete,
  };

  return (
    <FFTabs
      backgroundColor={theme.background.hoverable}
      onSelect={handleOnSelect}
      tools={
        <GlobalHighlight elements={resultsMap[tab]} id={highlightToggleId} label={highlightLabel} />
      }
    >
      <FFTabItem
        id={`${idRef.current}-${RuleType.VIOLATION}`}
        title={`${results.violations.length} Violations`}
        color={theme.color.negative}
      >
        {(props) => (
          <Report
            {...props}
            items={results.violations}
            type={RuleType.VIOLATION}
            empty="No accessibility violations found."
          />
        )}
      </FFTabItem>
      <FFTabItem
        id={`${idRef.current}-${RuleType.PASS}`}
        title={`${results.passes.length} Passes`}
        color={theme.color.positive}
      >
        {(props) => (
          <Report
            {...props}
            items={results.passes}
            type={RuleType.PASS}
            empty="No accessibility checks passed."
          />
        )}
      </FFTabItem>
      <FFTabItem
        id={`${idRef.current}-${RuleType.INCOMPLETION}`}
        title={`${results.incomplete.length} Incomplete`}
        color={theme.color.warning}
      >
        {(props) => (
          <Report
            {...props}
            items={results.incomplete}
            type={RuleType.INCOMPLETION}
            empty="No accessibility checks incomplete."
          />
        )}
      </FFTabItem>
    </FFTabs>
  );
};
