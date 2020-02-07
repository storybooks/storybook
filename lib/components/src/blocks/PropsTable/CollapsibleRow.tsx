import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { relative } from 'path';
import { PropDef } from './PropDef';
import { PropRows } from './PropRows';
import { Icons } from '../../icon/icon';

const ExpanderIcon = styled(Icons)(({ theme }) => ({
  marginRight: 8,
  marginLeft: -10,
  marginTop: -2, // optical alignment
  height: 12,
  width: 12,
  color:
    theme.base === 'light'
      ? transparentize(0.25, theme.color.defaultText)
      : transparentize(0.3, theme.color.defaultText),
  border: 'none',
}));

const ClickIntercept = styled.button<{}>(() => ({
  // reset button style
  background: 'none',
  border: 'none',
  padding: '0',
  font: 'inherit',
  outline: 'inherit',

  // add custom style
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  height: '100%',
  width: '100%',
  color: 'transparent',
  cursor: 'row-resize !important',
}));

export interface CollapsibleRowProps {
  section: string;
  expanded: boolean;
  rows: PropDef[];
  numRows: number;
}

const NameTh = styled.th(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  color: `${theme.color.defaultText} !important`, // overrides the default th style
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
}));

const Th = styled.th(({ theme }) => ({
  fontWeight: theme.typography.weight.regular,
  color: transparentize(0.2, theme.color.defaultText),
  position: 'relative',
}));

const Tr = styled.tr(({ theme }) => ({
  '&& > th': {
    paddingTop: 10,
    paddingBottom: 10,
  },
  '&:hover > th': {
    backgroundColor: theme.background.hoverable,
    boxShadow: `${theme.color.mediumlight} 0 - 1px 0 0 inset`,
  },
}));

export const CollapsibleRow: FC<CollapsibleRowProps> = ({ section, expanded, numRows, rows }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  let titleHelperText = `Show ${section}'s ${numRows} prop${numRows !== 1 ? 's' : ''}`;
  if (isExpanded) {
    titleHelperText = `Hide ${section}'s ${numRows} prop${numRows !== 1 ? 's' : ''}`;
  }

  return (
    <>
      <Tr>
        <NameTh colSpan={1}>
          <ClickIntercept
            onClick={expanded === undefined ? undefined : () => setIsExpanded(!isExpanded)}
            title={titleHelperText}
          >
            {titleHelperText}
          </ClickIntercept>

          {isExpanded ? <ExpanderIcon icon="arrowdown" /> : <ExpanderIcon icon="arrowright" />}
          {section}
        </NameTh>
        <Th colSpan={2}>
          <ClickIntercept
            onClick={expanded === undefined ? undefined : () => setIsExpanded(!isExpanded)}
            title={titleHelperText}
          >
            {titleHelperText}
          </ClickIntercept>
          {!isExpanded && `${numRows} prop${numRows !== 1 ? 's' : ''}`}
        </Th>
      </Tr>
      {isExpanded && <PropRows section={section} rows={rows} />}
    </>
  );
};
