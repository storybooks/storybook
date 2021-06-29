/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';

interface ButtonProps {
  /**
   * Sets the button size.
   */
  variant?: 'small' | 'large';
  /**
   * Disables the button.
   */
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled = false, variant = 'small', children }, ref) => (
    // eslint-disable-next-line react/button-has-type
    <button disabled={disabled} ref={ref}>
      {children} {variant}
    </button>
  )
);

export default Button;

export const component = Button;
