type RequestAccountAccessToken = {
  type: 'RequestAccountAccessToken';
};
type RequestReboot = {
  type: 'RequestReboot';
};
type RegisterNfcCard = {
  type: 'RegisterNfcCard';
  payload: {
    account_id: string;
  };
};
export type WebSocketRequest = RequestAccountAccessToken | RequestReboot | RegisterNfcCard;

type FoundUnknownBarcode = {
  type: 'FoundUnknownBarcode';
  payload: {
    code: string;
  };
};
type FoundUnknownNfcCard = {
  type: 'FoundUnknownNfcCard';
  payload: {
    id: string;
    name: string;
  };
};
type FoundProductId = {
  type: 'FoundProductId';
  payload: {
    product_id: string;
  };
};
type FoundAccountAccessToken = {
  type: 'FoundAccountAccessToken';
  payload: {
    access_token: string;
  };
};
type NfcCardRemoved = {
  type: 'NfcCardRemoved';
};
export type WebSocketResponse =
  | FoundUnknownBarcode
  | FoundUnknownNfcCard
  | FoundProductId
  | FoundAccountAccessToken
  | NfcCardRemoved;

export type WebSocketMessageHandler = (message: WebSocketResponse) => void;

export class AsciiPayAuthenticationClient {
  url: string;
  socket: WebSocket;
  handlerList: WebSocketMessageHandler[];
  connected: boolean;
  queue: (() => void)[];

  constructor(url: string) {
    this.url = url;
    this.connected = false;
    this.socket = this.createWebSocket();
    this.handlerList = [];
    this.queue = [];
  }

  private createWebSocket(): WebSocket {
    let self = this;
    const socket = new WebSocket(this.url);

    socket.addEventListener('open', function () {
      self.connected = true;

      for (let q of self.queue) {
        q();
      }

      self.queue = [];
    });

    socket.addEventListener('close', function () {
      self.queue = [];
      self.connected = false;
      setTimeout(() => {
        self.socket = self.createWebSocket();
      }, 1000);
    });

    socket.addEventListener('message', function (event) {
      let message: WebSocketResponse = JSON.parse(event.data);

      for (const handler of self.handlerList) {
        handler(message);
      }
    });

    return socket;
  }

  addEventHandler(handler: WebSocketMessageHandler) {
    this.handlerList.push(handler);
  }

  removeEventHandler(handler: WebSocketMessageHandler) {
    const index = this.handlerList.indexOf(handler);
    if (index >= 0) {
      this.handlerList.splice(index, 1);
    }
  }

  requestAccountAccessToken() {
    const action = () => {
      const message: RequestAccountAccessToken = {
        type: 'RequestAccountAccessToken',
      };

      this.socket.send(JSON.stringify(message));
    };

    if (this.connected) {
      action();
    } else {
      this.queue.push(action);
    }
  }

  requestReboot() {
    const action = () => {
      const message: RequestReboot = {
        type: 'RequestReboot',
      };

      this.socket.send(JSON.stringify(message));
    };

    if (this.connected) {
      action();
    } else {
      this.queue.push(action);
    }
  }

  registerNfcCard(account_id: string) {
    const action = () => {
      const message: RegisterNfcCard = {
        type: 'RegisterNfcCard',
        payload: {
          account_id: account_id,
        },
      };

      this.socket.send(JSON.stringify(message));
    };

    if (this.connected) {
      action();
    } else {
      this.queue.push(action);
    }
  }
}
