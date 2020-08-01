import { Context, createContext } from 'react';

export interface DocsContextProps {
  id?: string;
  kind?: string;
  name?: string;

  /**
   * mdxStoryNameToKey is an MDX-compiler-generated mapping of an MDX story's
   * display name to its story key for ID generation. It's used internally by the `<Story>`
   * and `Preview` doc blocks.
   */
  mdxStoryNameToKey?: Record<string, string>;
  mdxComponentMeta?: any;
  parameters?: any;
  storyStore?: any;
  globalArgs?: any;
  forceRender?: () => void;
}

export const DocsContext: Context<DocsContextProps> = createContext({});
