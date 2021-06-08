import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Global, styled } from '@storybook/theming';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { Filters } from '../components/ColorFilters';

const iframeId = 'storybook-preview-iframe';

const baseList = [
  'blurred vision',
  'deuteranomaly',
  'deuteranopia',
  'protanomaly',
  'protanopia',
  'tritanomaly',
  'tritanopia',
  'achromatomaly',
  'achromatopsia',
  'grayscale',
] as const;

type Filter = typeof baseList[number] | null;

const getFilter = (filter: Filter) => {
  if (!filter) {
    return 'none';
  }
  if (filter === 'blurred vision') {
    return 'blur(2px)';
  }
  if (filter === 'grayscale') {
    return 'grayscale(100%)';
  }
  return `url('#${filter}')`;
};

const Hidden = styled.div(() => ({
  '&, & svg': {
    position: 'absolute',
    width: 0,
    height: 0,
  },
}));

const ColorIcon = styled.span<{ filter: Filter }>(
  {
    background: 'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
    borderRadius: '1rem',
    display: 'block',
    height: '1rem',
    width: '1rem',
  },
  ({ filter }) => ({
    filter: getFilter(filter),
  }),
  ({ theme }) => ({
    boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  })
);

export interface Link {
  id: string;
  title: ReactNode;
  right?: ReactNode;
  active: boolean;
  onClick: () => void;
}

const getColorList = (active: Filter, set: (i: Filter) => void): Link[] => [
  ...(active !== null
    ? [
        {
          id: 'reset',
          title: 'Reset color filter',
          onClick: () => {
            set(null);
          },
          right: undefined,
          active: false,
        },
      ]
    : []),
  ...baseList.map((i) => ({
    id: i,
    title: i.charAt(0).toUpperCase() + i.slice(1),
    onClick: () => {
      set(i);
    },
    right: <ColorIcon filter={i} />,
    active: active === i,
  })),
];

export const A11yVisionSimulator: FunctionComponent = () => {
  const [filter, setFilter] = useState<Filter>(null);

  return (
    <>
      {filter && (
        <Global
          styles={{
            [`#${iframeId}`]: {
              filter: getFilter(filter),
            },
          }}
        />
      )}
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={({ onHide }) => {
          const colorList = getColorList(filter, (i) => {
            setFilter(i);
            onHide();
          });
          return <TooltipLinkList links={colorList} />;
        }}
        closeOnClick
        onDoubleClick={() => setFilter(null)}
      >
        <IconButton key="filter" active={!!filter} title="Vision simulator">
          <Icons icon="accessibility" />
        </IconButton>
      </WithTooltip>
      <Hidden>
        <Filters />
      </Hidden>
    </>
  );
};
