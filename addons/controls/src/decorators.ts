import { useChannel, useArgs } from '@storybook/client-api';
import { StoryFn, useStoryContext } from '@storybook/addons';
import { CONTROL_BUTTON_CLICK } from './constants';

export const withButtonActions = (storyFn: StoryFn) => {
  const [args, updateArgs] = useArgs();
  const context = useStoryContext();

  useChannel({
    [CONTROL_BUTTON_CLICK]: (name: string) => {
      // FIXME: I don't have a way to enforce those values, as i don't have the arg types :(
      updateArgs(args[name](args));
    },
  });
  return storyFn({ ...context, args });
};
