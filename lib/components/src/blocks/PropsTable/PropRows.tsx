import React, { FC } from 'react';
import { PropDef } from './PropDef';
import { PropRow } from './PropRow';

export interface PropRowsProps {
  rows: PropDef[];
  section?: string;
}

export const PropRows: FC<PropRowsProps> = ({ section, rows }) => (
  <>
    {rows.map(row => (
      <PropRow key={`${section || ''}${row.name}`} row={row} />
    ))}
  </>
);
