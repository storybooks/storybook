import React, { FC } from 'react';
import { Args, ArgTypes, useArgs, useChannel, useArgTypes, useParameter } from '@storybook/api';
import { ArgsTable, NoControlsWarning, PresetColor, SortType } from '@storybook/components';

import { CONTROL_BUTTON_CLICK, PARAM_KEY } from './constants';

interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
  hideNoControlsWarning?: boolean;
}

export const ControlsPanel: FC = () => {
  const emit = useChannel({});
  const [args, updateArgs, resetArgs] = useArgs();
  const rows = useArgTypes();
  const isArgsStory = useParameter<boolean>('__isArgsStory', false);
  const {
    expanded,
    sort,
    presetColors,
    hideNoControlsWarning = false,
  } = useParameter<ControlsParameters>(PARAM_KEY, {});

  const buttonArgs = Object.entries(rows).reduce(
    (acc, [key, { control }]) => ({
      ...acc,
      [key]: control?.type === 'button' ? () => emit(CONTROL_BUTTON_CLICK, key) : args[key],
    }),
    {} as Args
  );
  const hasControls = Object.values(rows).some((arg) => arg?.control);
  const showWarning = !(hasControls && isArgsStory) && !hideNoControlsWarning;

  const withPresetColors = Object.entries(rows).reduce((acc, [key, arg]) => {
    if (arg?.control?.type !== 'color' || arg?.control?.presetColors) acc[key] = arg;
    else acc[key] = { ...arg, control: { ...arg.control, presetColors } };
    return acc;
  }, {} as ArgTypes);

  return (
    <>
      {showWarning && <NoControlsWarning />}
      <ArgsTable
        {...{
          compact: !expanded && hasControls,
          rows: withPresetColors,
          args: buttonArgs,
          updateArgs,
          resetArgs,
          inAddonPanel: true,
          sort,
        }}
      />
    </>
  );
};
