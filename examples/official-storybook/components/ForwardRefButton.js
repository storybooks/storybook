import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import BaseButton from './BaseButton';

const ForwardRefButtonRender = ({ label, ...props }, ref) => (
  <BaseButton label={label} {...props} ref={ref} />
);

ForwardRefButtonRender.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.shape({}),
};

ForwardRefButtonRender.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

export const ForwardRefButtonInnerPropTypes = forwardRef(ForwardRefButtonRender);

export const ForwardRefButtonOuterPropTypes = forwardRef(({ label, ...props }, ref) => (
  <BaseButton label={label} {...props} ref={ref} />
));

ForwardRefButtonOuterPropTypes.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

ForwardRefButtonOuterPropTypes.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.shape({}),
};
