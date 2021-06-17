/* eslint-disable react/default-props-match-prop-types */
import { ANALYZER_ADDRESS } from 'global';
import React from 'react';

interface Props {
  active: boolean;
}

const Panel = ({ active }: Props) =>
  active ? (
    <iframe
      style={{ margin: 0, border: 0, width: '100%' }}
      title="bundle-analyzer"
      src={ANALYZER_ADDRESS}
    />
  ) : null;

Panel.defaultProps = {
  tests: null,
};

export default Panel;
