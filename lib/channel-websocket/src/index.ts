import { Channel, ChannelHandler } from '@storybook/channels';
import root from '@storybook/global-root';
import { isJSON, parse, stringify } from 'telejson';

const { WebSocket } = root;

type OnError = (message: Event) => void;

interface WebsocketTransportArgs {
  url: string;
  onError: OnError;
}

interface CreateChannelArgs {
  url: string;
  async: boolean;
  onError: OnError;
}

export class WebsocketTransport {
  private socket: WebSocket;

  private handler: ChannelHandler;

  private buffer: string[] = [];

  private isReady = false;

  constructor({ url, onError }: WebsocketTransportArgs) {
    this.connect(url, onError);
  }

  setHandler(handler: ChannelHandler) {
    this.handler = handler;
  }

  send(event: any) {
    if (!this.isReady) {
      this.sendLater(event);
    } else {
      this.sendNow(event);
    }
  }

  private sendLater(event: any) {
    this.buffer.push(event);
  }

  private sendNow(event: any) {
    const data = stringify(event, { maxDepth: 15, allowFunction: true });
    this.socket.send(data);
  }

  private flush() {
    const { buffer } = this;
    this.buffer = [];
    buffer.forEach((event) => this.send(event));
  }

  private connect(url: string, onError: OnError) {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      this.isReady = true;
      this.flush();
    };
    this.socket.onmessage = ({ data }) => {
      const event = typeof data === 'string' && isJSON(data) ? parse(data) : data;
      this.handler(event);
    };
    this.socket.onerror = (e) => {
      if (onError) {
        onError(e);
      }
    };
  }
}

export default function createChannel({ url, async, onError }: CreateChannelArgs) {
  const transport = new WebsocketTransport({ url, onError });
  return new Channel({ transport, async });
}
