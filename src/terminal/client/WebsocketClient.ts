import {
  dispatchClientMessage,
  TerminalClientMessageHandler,
  WebSocketRequest,
  WebSocketResponse,
} from "./websocket";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";
import { CardTypeDto } from "../../redux/api/contracts";

export class WebSocketClient implements AsciiPayAuthenticationClient {
  url: string;
  socket: WebSocket;
  handlerList: TerminalClientMessageHandler[];
  fallbackHandlerList: TerminalClientMessageHandler[];
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
        if (dispatchClientMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchClientMessage(message, handler);
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
        if (dispatchClientMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchClientMessage(message, handler);
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
        if (dispatchClientMessage(message, handler)) {
          useFallbackHandler = false;
        }
      }

      if (useFallbackHandler) {
        for (const handler of self.fallbackHandlerList) {
          dispatchClientMessage(message, handler);
        }
      }
    });

    return socket;
  }

  dispatch(message: WebSocketResponse) {
    let self = this;
    let useFallbackHandler = true;
    for (const handler of self.handlerList) {
      if (dispatchClientMessage(message, handler)) {
        useFallbackHandler = false;
      }
    }

    if (useFallbackHandler) {
      for (const handler of self.fallbackHandlerList) {
        dispatchClientMessage(message, handler);
      }
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  addEventHandler(handler: TerminalClientMessageHandler) {
    this.handlerList.push(handler);
  }

  removeEventHandler(handler: TerminalClientMessageHandler) {
    const index = this.handlerList.indexOf(handler);
    if (index >= 0) {
      this.handlerList.splice(index, 1);
    }
  }

  addFallbackEventHandler(handler: TerminalClientMessageHandler) {
    this.fallbackHandlerList.push(handler);
  }

  removeFallbackEventHandler(handler: TerminalClientMessageHandler) {
    const index = this.fallbackHandlerList.indexOf(handler);
    if (index >= 0) {
      this.fallbackHandlerList.splice(index, 1);
    }
  }

  requestNfcIdentifyResponse(card_id: string, card_type: CardTypeDto): void {
    this.sendWebSocketRequest({
      type: "NfcIdentifyResponse",
      payload: {
        card_id,
        card_type,
      },
    });
  }

  requestNfcChallengeResponse(card_id: string, challenge: string): void {
    this.sendWebSocketRequest({
      type: "NfcChallengeResponse",
      payload: {
        card_id,
        challenge,
      },
    });
  }

  requestNfcResponseResponse(card_id: string, session_key: string): void {
    this.sendWebSocketRequest({
      type: "NfcResponseResponse",
      payload: {
        card_id,
        session_key,
      },
    });
  }

  requestNfcRegister(card_id: string): void {
    this.sendWebSocketRequest({
      type: "NfcRegister",
      payload: {
        card_id,
      },
    });
  }

  requestNfcReauthenticate() {
    this.sendWebSocketRequest({
      type: "NfcReauthenticate",
    });
  }

  receiveSessionToken(token: string): void {
    this.dispatch({
      type: "ReceiveSessionToken",
      payload: {
        token,
      },
    });
  }

  receiveUnregisteredNfcCard(name: string, card_id: string): void {
    this.dispatch({
      type: "ReceiveUnregisteredNfcCard",
      payload: {
        name,
        card_id,
      },
    });
  }

  sendWebSocketRequest(message: WebSocketRequest) {
    const action = () => {
      this.socket.send(JSON.stringify(message));
    };

    if (this.connected) {
      action();
    } else {
      this.queue.push(action);
    }
  }
}
