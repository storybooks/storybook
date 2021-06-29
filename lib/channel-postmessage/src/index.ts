import root from '@storybook/global-root';
import * as EVENTS from '@storybook/core-events';
import Channel, { ChannelEvent, ChannelHandler } from '@storybook/channels';
import { logger, pretty } from '@storybook/client-logger';
import { isJSON, parse, stringify } from 'telejson';
import qs from 'qs';

const { document, location } = root;

interface Config {
  page: 'manager' | 'preview';
}

interface BufferedEvent {
  event: ChannelEvent;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export const KEY = 'storybook-channel';

const nodeListToArray = <T extends HTMLElement = HTMLElement>(nodeList: NodeListOf<T>) => {
  const nodeArray = Array.prototype.slice.call(nodeList) as T[];
  return nodeArray;
};

const getNodeArray = <T extends HTMLElement = HTMLElement>(selector: string) => {
  const nodeList = document.querySelectorAll<T>(selector);
  const nodeArray = nodeListToArray<T>(nodeList);

  return nodeArray;
};

// TODO: we should export a method for opening child windows here and keep track of em.
// that way we can send postMessage to child windows as well, not just iframe
// https://stackoverflow.com/questions/6340160/how-to-get-the-references-of-all-already-opened-child-windows

export class PostmsgTransport {
  private buffer: BufferedEvent[];

  private handler: ChannelHandler;

  private connected: boolean;

  constructor(private readonly config: Config) {
    this.buffer = [];
    this.handler = null;
    root.addEventListener('message', this.handleEvent.bind(this), false);

    // Check whether the config.page parameter has a valid value
    if (config.page !== 'manager' && config.page !== 'preview') {
      throw new Error(`postmsg-channel: "config.page" cannot be "${config.page}"`);
    }
  }

  setHandler(handler: ChannelHandler): void {
    this.handler = (...args) => {
      handler.apply(this, args);

      if (!this.connected && this.getLocalFrame().length) {
        this.flush();
        this.connected = true;
      }
    };
  }

  /**
   * Sends `event` to the associated window. If the window does not yet exist
   * the event will be stored in a buffer and sent when the window exists.
   * @param event
   */
  send(event: ChannelEvent, options?: any): Promise<any> {
    let depth = 25;
    let allowFunction = true;
    let target;

    if (options && typeof options.allowFunction === 'boolean') {
      allowFunction = options.allowFunction;
    }
    if (options && Number.isInteger(options.depth)) {
      depth = options.depth;
    }
    if (options && typeof options.target === 'string') {
      target = options.target;
    }

    const frames = this.getFrames(target);

    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    const data = stringify(
      {
        key: KEY,
        event,
        refId: query.refId,
      },
      { maxDepth: depth, allowFunction }
    );

    if (!frames.length) {
      return new Promise((resolve, reject) => {
        this.buffer.push({ event, resolve, reject });
      });
    }
    if (this.buffer.length) {
      this.flush();
    }

    frames.forEach((f) => {
      try {
        f.postMessage(data, '*');
      } catch (e) {
        console.error('sending over postmessage fail');
      }
    });

    return Promise.resolve(null);
  }

  private flush(): void {
    const { buffer } = this;
    this.buffer = [];
    buffer.forEach((item) => {
      this.send(item.event).then(item.resolve).catch(item.reject);
    });
  }

  private getFrames(target?: string): Window[] {
    if (this.config.page === 'manager') {
      const nodeArray = getNodeArray<HTMLIFrameElement>(
        'iframe[data-is-storybook][data-is-loaded]'
      );

      const list = nodeArray
        .filter((e) => {
          try {
            return !!e.contentWindow && e.dataset.isStorybook !== undefined && e.id === target;
          } catch (er) {
            return false;
          }
        })
        .map((e) => e.contentWindow);

      return list.length ? list : this.getCurrentFrames();
    }
    if (root && root.parent && root.parent !== root) {
      return [root.parent];
    }

    return [];
  }

  private getCurrentFrames(): Window[] {
    if (this.config.page === 'manager') {
      const list = getNodeArray<HTMLIFrameElement>('[data-is-storybook="true"]');
      return list.map((e) => e.contentWindow);
    }
    if (root && root.parent) {
      return [root.parent];
    }

    return [];
  }

  private getLocalFrame(): Window[] {
    if (this.config.page === 'manager') {
      const list = getNodeArray<HTMLIFrameElement>('#storybook-preview-iframe');
      return list.map((e) => e.contentWindow);
    }
    if (root && root.parent) {
      return [root.parent];
    }

    return [];
  }

  private handleEvent(rawEvent: MessageEvent): void {
    try {
      const { data } = rawEvent;
      const { key, event, refId } = typeof data === 'string' && isJSON(data) ? parse(data) : data;

      if (key === KEY) {
        const pageString =
          this.config.page === 'manager'
            ? `<span style="color: #37D5D3; background: black"> manager </span>`
            : `<span style="color: #1EA7FD; background: black"> preview </span>`;

        const eventString = Object.values(EVENTS).includes(event.type)
          ? `<span style="color: #FF4785">${event.type}</span>`
          : `<span style="color: #FFAE00">${event.type}</span>`;

        if (refId) {
          event.refId = refId;
        }

        event.source =
          this.config.page === 'preview' ? rawEvent.origin : getEventSourceUrl(rawEvent);

        if (!event.source) {
          pretty.error(
            `${pageString} received ${eventString} but was unable to determine the source of the event`
          );

          return;
        }
        const message = `${pageString} received ${eventString} (${data.length})`;
        pretty.debug(
          location.origin !== event.source
            ? message
            : `${message} <span style="color: gray">(on ${location.origin} from ${event.source})</span>`,
          ...event.args
        );

        this.handler(event);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}

const getEventSourceUrl = (event: MessageEvent) => {
  const frames = getNodeArray<HTMLIFrameElement>('iframe[data-is-storybook]');
  // try to find the originating iframe by matching it's contentWindow
  // This might not be cross-origin safe
  const [frame, ...remainder] = frames.filter((element) => {
    try {
      return element.contentWindow === event.source;
    } catch (err) {
      // continue
    }

    const src = element.getAttribute('src');
    let origin;

    try {
      ({ origin } = new URL(src, document.location.toString()));
    } catch (err) {
      return false;
    }
    return origin === event.origin;
  });

  if (frame && remainder.length === 0) {
    const src = frame.getAttribute('src');
    const { protocol, host, pathname } = new URL(src, document.location.toString());
    return `${protocol}//${host}${pathname}`;
  }

  if (remainder.length > 0) {
    // If we found multiple matches, there's going to be trouble
    logger.error('found multiple candidates for event source');
  }

  // If we found no frames of matches
  return null;
};

/**
 * Creates a channel which communicates with an iframe or child window.
 */
export default function createChannel({ page }: Config): Channel {
  const transport = new PostmsgTransport({ page });
  return new Channel({ transport });
}
