import global from 'global';
import axe from 'axe-core';
import addons from '@storybook/addons';
import { EVENTS } from '../constants';
import { A11yParameters } from '../params';

const { document, window: globalWindow } = global;

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

const channel = addons.getChannel();
// Holds axe core running state
let active = false;
// Holds latest story we requested a run
let activeStoryId: string | undefined;

const getElement = () => {
  const storyRoot = document.getElementById('story-root');
  return storyRoot ? storyRoot.children : document.getElementById('root');
};

/**
 * Handle A11yContext events.
 * Because the event are sent without manual check, we split calls
 */
const handleRequest = (storyId: string) => {
  const { manual } = getParams(storyId);
  if (!manual) {
    run(storyId);
  }
};

const run = async (storyId: string) => {
  activeStoryId = storyId;
  try {
    const input = getParams(storyId);

    if (!active) {
      active = true;
      channel.emit(EVENTS.RUNNING);

      const { element = getElement(), config, options = {} } = input;
      axe.reset();
      if (config) {
        axe.configure(config);
      }

      const result = await axe.run(element, options);
      // It's possible that we requested a new run on a different story.
      // Unfortunately, axe doesn't support a cancel method to abort current run.
      // We check if the story we run against is still the current one,
      // if not, trigger a new run using the current story
      if (activeStoryId === storyId) {
        channel.emit(EVENTS.RESULT, result);
      } else {
        active = false;
        run(activeStoryId);
      }
    }
  } catch (error) {
    channel.emit(EVENTS.ERROR, error);
  } finally {
    active = false;
  }
};

/** Returns story parameters or default ones. */
const getParams = (storyId: string): A11yParameters => {
  const { parameters } = globalWindow.__STORYBOOK_STORY_STORE__.fromId(storyId) || {};
  return (
    parameters.a11y || {
      config: {},
      options: {
        restoreScroll: true,
      },
    }
  );
};

channel.on(EVENTS.REQUEST, handleRequest);
channel.on(EVENTS.MANUAL, run);
