import { Addon } from '@storybook/addons';
import { Combo, Consumer } from '@storybook/api';
import { IconButton, Icons } from '@storybook/components';
import root from '@storybook/global-root';
import React from 'react';
import { stringifyQueryParams } from '../utils/stringifyQueryParams';

const { PREVIEW_URL } = root;

const ejectMapper = ({ state }: Combo) => {
  const { storyId, refId, refs } = state;
  const ref = refs[refId];

  return {
    refId,
    baseUrl: ref ? `${ref.url}/iframe.html` : (PREVIEW_URL as string) || 'iframe.html',
    storyId,
    queryParams: state.customQueryParams,
  };
};

export const ejectTool: Addon = {
  title: 'eject',
  id: 'eject',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={ejectMapper}>
      {({ baseUrl, storyId, queryParams }) =>
        storyId ? (
          <IconButton
            key="opener"
            href={`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`}
            target="_blank"
            title="Open canvas in new tab"
          >
            <Icons icon="sharealt" />
          </IconButton>
        ) : null
      }
    </Consumer>
  ),
};
