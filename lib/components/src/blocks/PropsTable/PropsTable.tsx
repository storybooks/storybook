import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { opacify, transparentize, darken, lighten } from 'polished';
import { PropRows, PropRowsProps } from './PropRows';
import { SectionRow } from './SectionRow';
import { CollapsibleRow } from './CollapsibleRow';
import { PropDef, PropType, PropDefaultValue, PropSummaryValue, PropParent } from './PropDef';
import { EmptyBlock } from '../EmptyBlock';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export const Table = styled.table<{ expandable: boolean }>(({ theme, expandable }) => ({
  '&&': {
    // Resets for cascading/system styles
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    borderSpacing: 0,
    color: theme.color.defaultText,
    tr: {
      border: 'none',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
      verticalAlign: 'top',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    // End Resets

    fontSize: theme.typography.size.s2,
    lineHeight: '20px',
    textAlign: 'left',
    width: '100%',

    // Margin collapse
    marginTop: 25,
    marginBottom: 40,

    'thead th:first-of-type, td:first-of-type': {
      width: '30%',
    },

    'th:first-of-type, td:first-of-type': {
      paddingLeft: '20px',
      wordBreak: 'break-all',
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: 20,
      width: '20%',
    },

    th: {
      color:
        theme.base === 'light'
          ? transparentize(0.25, theme.color.defaultText)
          : transparentize(0.45, theme.color.defaultText),
      paddingTop: 10,
      paddingBottom: 10,

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },
    },

    td: {
      paddingTop: '10px',
      paddingBottom: '10px',
      ':first-of-type': {
        paddingLeft: expandable ? '45px' : '20px',
      },
      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },

      '&:last-of-type': {
        paddingRight: 20,
      },
    },

    // Table "block" styling
    // Emphasize tbody's background and set borderRadius
    // Calling out because styling tables is finicky

    // Makes border alignment consistent w/other DocBlocks
    marginLeft: 1,
    marginRight: 1,

    'tr:first-child': {
      'td:first-child, th:first-child': {
        borderTopLeftRadius: theme.appBorderRadius,
      },
      'td:last-child, th:last-child': {
        borderTopRightRadius: theme.appBorderRadius,
      },
    },

    'tr:last-child': {
      'td:first-child, th:first-child': {
        borderBottomLeftRadius: theme.appBorderRadius,
      },
      'td:last-child, th:last-child': {
        borderBottomRightRadius: theme.appBorderRadius,
      },
    },

    tbody: {
      // slightly different than the other DocBlock shadows to account for table styling gymnastics
      boxShadow:
        theme.base === 'light'
          ? `rgba(0, 0, 0, 0.10) 0 1px 3px 1px,
          ${transparentize(0.035, theme.appBorderColor)} 0 0 0 1px`
          : `rgba(0, 0, 0, 0.20) 0 2px 5px 1px,
          ${opacify(0.05, theme.appBorderColor)} 0 0 0 1px`,
      borderRadius: theme.appBorderRadius,

      tr: {
        background: 'transparent',
        overflow: 'hidden',
        '&:not(:first-child)': {
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor:
            theme.base === 'light'
              ? darken(0.1, theme.background.content)
              : lighten(0.05, theme.background.content),
        },
      },

      td: {
        background: theme.background.content,
      },
    },
    // End finicky table styling
  },
}));

export enum PropsTableError {
  NO_COMPONENT = 'No component found',
  PROPS_UNSUPPORTED = 'Props unsupported. See Props documentation for your framework.',
}

export interface PropsTableSectionsProps {
  sections?: Record<string, PropDef[]>;
  expanded?: string[];
}

export interface PropsTableErrorProps {
  error: PropsTableError;
}

export type PropsTableProps = PropRowsProps | PropsTableSectionsProps | PropsTableErrorProps;

interface SectionTableRowProps {
  section: string;
  rows: PropDef[];
  expanded?: string[];
}

const SectionTableRow: FC<SectionTableRowProps> = ({ section, rows, expanded }) => {
  if (expanded) {
    return (
      <CollapsibleRow
        section={section}
        expanded={expanded.indexOf(section) >= 0}
        rows={rows}
        numRows={rows.length}
      />
    );
  }
  return (
    <>
      <SectionRow section={section} />
      <PropRows section={section} rows={rows} />
    </>
  );
};

/**
 * Display the props for a component as a props table. Each row is a collection of
 * PropDefs, usually derived from docgen info for the component.
 */
const PropsTable: FC<PropsTableProps> = props => {
  const { error } = props as PropsTableErrorProps;
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }

  let allRows: React.ReactNode[] | React.ReactNode;
  const { sections, expanded } = props as PropsTableSectionsProps;
  const { rows } = props as PropRowsProps;
  if (sections) {
    allRows = Object.keys(sections).map(section => (
      <SectionTableRow
        key={section}
        section={section}
        rows={sections[section]}
        expanded={expanded}
      />
    ));
  } else if (rows) {
    allRows = <PropRows rows={rows} />;
  }

  if (Array.isArray(allRows) && allRows.length === 0) {
    return <EmptyBlock>No props found for this component</EmptyBlock>;
  }
  return (
    <ResetWrapper>
      <Table className="docblock-propstable" expandable={expanded !== undefined}>
        <thead className="docblock-propstable-head">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody className="docblock-propstable-body">{allRows}</tbody>
      </Table>
    </ResetWrapper>
  );
};

export {
  PropsTable,
  PropDef,
  PropType,
  PropDefaultValue,
  PropSummaryValue,
  PropParent,
  PropRowsProps,
};
