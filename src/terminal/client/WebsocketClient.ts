import {
  dispatchWebSocketMessage,
  WebSocketMessageHandler,
  WebSocketRequest,
  WebSocketResponse,
} from "./websocket";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";

export class WebSocketClient implements AsciiPayAuthenticationClient {
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

    socket.addEventListener("open", function () {
      self.connected = true;

      let message: WebSocketResponse = {
        type: "ConnectionStateChange",
        payload: {
          connected: true,
        },
      };
      let useFallbackHandler = true;
      for (const handler of self.handlerList) {
        if (dispatchWebSocketMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchWebSocketMessage(message, handler);
        }
      }

      for (let q of self.queue) {
        q();
      }

      self.queue = [];
    });

    socket.addEventListener("close", function () {
      self.queue = [];
      self.connected = false;

      let message: WebSocketResponse = {
        type: "ConnectionStateChange",
        payload: {
          connected: false,
        },
      };
      let useFallbackHandler = true;
      for (const handler of self.handlerList) {
        if (dispatchWebSocketMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchWebSocketMessage(message, handler);
        }
      }

      setTimeout(() => {
        self.socket = self.createWebSocket();
      }, 1000);
    });

    socket.addEventListener("message", function (event) {
      let message: WebSocketResponse = JSON.parse(event.data);

      let useFallbackHandler = true;
      for (const handler of self.handlerList) {
        if (dispatchWebSocketMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchWebSocketMessage(message, handler);
        }
      }
    });

    return socket;
  }

  public isConnected(): boolean {
    return this.connected;
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

  requestNfcRefresh() {
    const action = () => {
      const message: WebSocketRequest = {
        type: "RequestNfcRefresh",
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
