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
type RequestStatusInformation = {
  type: 'RequestStatusInformation';
};
export type WebSocketRequest = RequestAccountAccessToken | RequestReboot | RegisterNfcCard | RequestStatusInformation;

type FoundUnknownBarcode = {
  type: 'FoundUnknownBarcode';
  payload: {
    code: string;
  };
};
type FoundAccountNumber = {
  type: 'FoundAccountNumber';
  payload: {
    account_number: string;
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
type StatusInformation = {
  type: 'StatusInformation';
  payload: {
    status: string;
  };
};
type Error = {
  type: 'Error';
  payload: {
    source: string;
    message: string;
  };
};
export type WebSocketResponse =
  | FoundUnknownBarcode
  | FoundAccountNumber
  | FoundUnknownNfcCard
  | FoundProductId
  | FoundAccountAccessToken
  | NfcCardRemoved
  | StatusInformation
  | Error;

export interface WebSocketMessageHandler {
  onMessage?(message: WebSocketResponse): void | boolean;

  onFoundUnknownBarcode?(code: string): void | boolean;
  onFoundAccountNumber?(accountNumber: string): void | boolean;
  onFoundUnknownNfcCard?(id: string, name: string): void | boolean;
  onFoundProductId?(product_id: string): void | boolean;
  onFoundAccountAccessToken?(accessToken: string): void | boolean;
  onNfcCardRemoved?(): void | boolean;
  onStatusInformation?(status: string): void | boolean;
  onError?(source: string, message: string): void | boolean;
}

function dispatchMessage(message: WebSocketResponse, handler: WebSocketMessageHandler) {
  let consumeMessage = handler.onMessage && handler.onMessage(message);
  let consumeType: boolean | void | undefined;
  switch (message.type) {
    case 'FoundUnknownBarcode':
      consumeType =
        (handler.onFoundUnknownBarcode && handler.onFoundUnknownBarcode(message.payload.code)) || consumeType;
      break;
    case 'FoundAccountNumber':
      consumeType =
        (handler.onFoundAccountNumber && handler.onFoundAccountNumber(message.payload.account_number)) || consumeType;
      break;
    case 'FoundUnknownNfcCard':
      consumeType =
        (handler.onFoundUnknownNfcCard && handler.onFoundUnknownNfcCard(message.payload.id, message.payload.name)) ||
        consumeType;
      break;
    case 'FoundProductId':
      consumeType = (handler.onFoundProductId && handler.onFoundProductId(message.payload.product_id)) || consumeType;
      break;
    case 'FoundAccountAccessToken':
      consumeType =
        (handler.onFoundAccountAccessToken && handler.onFoundAccountAccessToken(message.payload.access_token)) ||
        consumeType;
      break;
    case 'NfcCardRemoved':
      consumeType = (handler.onNfcCardRemoved && handler.onNfcCardRemoved()) || consumeType;
      break;
    case 'StatusInformation':
      consumeType = (handler.onStatusInformation && handler.onStatusInformation(message.payload.status)) || consumeType;
      break;
    case 'Error':
      consumeType =
        (handler.onError && handler.onError(message.payload.source, message.payload.message)) || consumeType;
      break;
  }

  return !!consumeType || !!consumeMessage;
}

export class AsciiPayAuthenticationClient {
  url: string;
  socket: WebSocket;
  handlerList: WebSocketMessageHandler[];
  fallbackHandlerList: WebSocketMessageHandler[];
  connected: boolean;
  queue: (() => void)[];

  constructor(url: string) {
    this.url = url;
    this.connected = false;
    this.socket = this.createWebSocket();
    this.handlerList = [];
    this.fallbackHandlerList = [];
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

      let useFallbackHandler = true;
      for (const handler of self.handlerList) {
        if (dispatchMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchMessage(message, handler);
        }
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

  addFallbackEventHandler(handler: WebSocketMessageHandler) {
    this.fallbackHandlerList.push(handler);
  }

  removeFallbackEventHandler(handler: WebSocketMessageHandler) {
    const index = this.fallbackHandlerList.indexOf(handler);
    if (index >= 0) {
      this.fallbackHandlerList.splice(index, 1);
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

  requestStatusInformation() {
    const action = () => {
      const message: RequestStatusInformation = {
        type: 'RequestStatusInformation',
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
