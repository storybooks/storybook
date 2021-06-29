import { StoryFn as StoryFunction, StoryContext, useMemo, useEffect } from '@storybook/addons';

import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';
import { clearStyles, addBackgroundStyle, getBackgroundColorByName } from '../helpers';

export const withBackground = (StoryFn: StoryFunction, context: StoryContext) => {
  const { globals, parameters } = context;
  const globalsBackgroundColor = globals[BACKGROUNDS_PARAM_KEY]?.value;
  const backgroundsConfig = parameters[BACKGROUNDS_PARAM_KEY];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const selectedBackgroundColor = useMemo(() => {
    if (backgroundsConfig.disable) {
      return 'transparent';
    }

    return getBackgroundColorByName(
      globalsBackgroundColor,
      backgroundsConfig.values,
      backgroundsConfig.default
    );
  }, [backgroundsConfig, globalsBackgroundColor]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isActive = useMemo(
    () => selectedBackgroundColor && selectedBackgroundColor !== 'transparent',
    [selectedBackgroundColor]
  );

  const selector =
    context.viewMode === 'docs' ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const backgroundStyles = useMemo(
    () => `
      ${selector} {
        background: ${selectedBackgroundColor} !important;
        transition: background-color 0.3s;
      }
    `,
    [selectedBackgroundColor, selector]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const selectorId =
      context.viewMode === 'docs'
        ? `addon-backgrounds-docs-${context.id}`
        : `addon-backgrounds-color`;

    if (!isActive) {
      clearStyles(selectorId);
      return;
    }

    addBackgroundStyle(
      selectorId,
      backgroundStyles,
      context.viewMode === 'docs' ? context.id : null
    );
  }, [isActive, backgroundStyles, context]);

  return StoryFn();
};
