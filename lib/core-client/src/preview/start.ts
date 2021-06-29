import { addons, Channel, DecorateStoryFunction } from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import { ClientApi, ConfigApi, StoryStore } from '@storybook/client-api';
import Events from '@storybook/core-events';
import root from '@storybook/global-root';
import { loadCsf } from './loadCsf';
import { StoryRenderer } from './StoryRenderer';
import { RenderStoryFunction } from './types';
import { getSelectionSpecifierFromPath, setPath } from './url';

const { navigator } = root;

const isBrowser =
  navigator &&
  navigator.userAgent &&
  navigator.userAgent !== 'storyshots' &&
  !(navigator.userAgent.indexOf('Node.js') > -1) &&
  !(navigator.userAgent.indexOf('jsdom') > -1);

function getOrCreateChannel() {
  let channel = null;
  if (isBrowser) {
    try {
      channel = addons.getChannel();
    } catch (e) {
      channel = createChannel({ page: 'preview' });
      addons.setChannel(channel);
    }
  }

  return channel;
}

function getClientApi(decorateStory: DecorateStoryFunction, channel?: Channel) {
  let storyStore: StoryStore;
  let clientApi: ClientApi;
  if (
    typeof root !== 'undefined' &&
    root.__STORYBOOK_CLIENT_API__ &&
    root.__STORYBOOK_STORY_STORE__
  ) {
    clientApi = root.__STORYBOOK_CLIENT_API__;
    storyStore = root.__STORYBOOK_STORY_STORE__;
  } else {
    storyStore = new StoryStore({ channel });
    clientApi = new ClientApi({ storyStore, decorateStory });
  }
  return { clientApi, storyStore };
}

function focusInInput(event: Event) {
  const target = event.target as Element;
  return /input|textarea/i.test(target.tagName) || target.getAttribute('contenteditable') !== null;
}

// todo improve typings
export default function start(
  render: RenderStoryFunction,
  { decorateStory }: { decorateStory?: DecorateStoryFunction } = {}
) {
  const channel = getOrCreateChannel();
  const { clientApi, storyStore } = getClientApi(decorateStory, channel);
  const configApi = new ConfigApi({ storyStore });
  const storyRenderer = new StoryRenderer({ render, channel, storyStore });

  // Only try and do URL/event based stuff in a browser context (i.e. not in storyshots)
  if (isBrowser) {
    const selectionSpecifier = getSelectionSpecifierFromPath();
    if (selectionSpecifier) {
      storyStore.setSelectionSpecifier(selectionSpecifier);
    }

    channel.on(Events.CURRENT_STORY_WAS_SET, setPath);

    // Handle keyboard shortcuts
    global.onkeydown = (event: KeyboardEvent) => {
      if (!focusInInput(event)) {
        // We have to pick off the keys of the event that we need on the other side
        const { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode } = event;
        channel.emit(Events.PREVIEW_KEYDOWN, {
          event: { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode },
        });
      }
    };
  }

  if (typeof root !== 'undefined') {
    root.__STORYBOOK_CLIENT_API__ = clientApi;
    root.__STORYBOOK_STORY_STORE__ = storyStore;
    root.__STORYBOOK_ADDONS_CHANNEL__ = channel; // may not be defined
  }

  const configure = loadCsf({ clientApi, storyStore, configApi });
  return {
    configure,
    clientApi,
    configApi,
    channel,
    forceReRender: () => storyRenderer.forceReRender(),
  };
}
