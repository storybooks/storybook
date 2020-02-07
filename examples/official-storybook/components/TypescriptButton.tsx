import React, { FC } from 'react';

interface ButtonProps {
  /** Own ButtonProps label */
  label: string;

  /** Another property */
  property1?: number;
}

/** Component description imported from comments inside the component file
 * This React component has its own properties but also accepts all the html `button` attributes.
 */
export const TypescriptButton: FC<ButtonProps & JSX.IntrinsicElements['button']> = ({
  label,
  ...rest
}) => (
  <button type="button" {...rest}>
    {label}
  </button>
);

TypescriptButton.defaultProps = {
  label: 'label',
};
