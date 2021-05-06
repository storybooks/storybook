import React, { FunctionComponent } from 'react';

export type Type = 'default' | 'action';

interface Props {
  /**
   * Click event `handler`
   * 
   * Example function:
   * 
   * ```
   * () => {
   *   doThis();
   * }
   * ```
   * 
   * @default null
   */
  onClick?: () => void;

  /**
   * Button type yo
   */
  type?: Type;
}

const Button: FunctionComponent<Props> = ({ children, type = 'default', onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {type}: {children}
    </button>
  );
};

export default Button;
