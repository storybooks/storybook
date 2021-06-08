import { ElementContext, Spec, RunOptions } from 'axe-core';

export interface A11yParameters {
  element?: ElementContext;
  config?: Spec;
  options?: RunOptions;
  manual?: boolean;
}
