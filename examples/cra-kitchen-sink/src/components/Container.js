import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ children, title, age, isAmazing }) => (
  <div title={title}>
    {children}
    {isAmazing ? '!!!' : ''}
    {age.isOld ? <div>age = {age.value}</div> : null}
  </div>
);

Container.propTypes = {
  /**
   * The nodes to be rendered in the button
   * 
   * Example value:
   * 
   * ```
   * <h1>Node 1</h1>
   * <h2>Node 2</h2>
   * ```
   */
  children: PropTypes.node.isRequired,
  /** Show exclamation marks */
  isAmazing: PropTypes.bool,
  /** Show age prop */
  age: PropTypes.shape({
    isOld: PropTypes.bool,
    value: PropTypes.number,
  }),
  /** Main title */
  title: PropTypes.string,
};
Container.defaultProps = {
  isAmazing: false,
  age: { isOld: false, value: 0 },
  title: 'the best container ever',
};

export default Container;
