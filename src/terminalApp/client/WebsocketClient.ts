import {
  dispatchClientMessage,
  TerminalClientMessageHandler,
  WebSocketRequest,
  WebSocketResponse,
} from "./websocket";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";
import { CardTypeDto } from "../../common/contracts";

/**
 * How often to send a keepalive frame on an otherwise idle socket. Short enough
 * to keep NAT/radio state warm so the connection does not silently die.
 */
const HEARTBEAT_INTERVAL_MS = 15000;

export class WebSocketClient implements AsciiPayAuthenticationClient {
  url: string;
  socket: WebSocket;
  handlerList: TerminalClientMessageHandler[];
  fallbackHandlerList: TerminalClientMessageHandler[];
  connected: boolean;
  queue: (() => void)[];
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  constructor(url: string) {
    this.url = url;
    this.connected = false;
    this.socket = this.createWebSocket();
    this.handlerList = [];
    this.fallbackHandlerList = [];
    this.queue = [];
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

  public toString(): string {
    return `Websocket(${this.url})`;
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

  /**
   * Keep the socket warm and recover a half-open ("zombie") one.
   *
   * When the kiosk tablet's radio sleeps (Samsung Doze / Wi-Fi power save) the
   * TCP connection is dropped without a FIN, so the browser never fires `close`
   * and `readyState` stays OPEN. The socket looks alive but silently swallows
   * everything the NFC reader pushes — including the `ReceiveSessionToken` that
   * is supposed to wake the app — which is why "open on tag" only worked
   * intermittently.
   *
   * The protocol has no ping, but the backend explicitly ignores empty frames
   * (`if msg_data.is_empty() { continue }`), so an empty frame is a safe no-op:
   * it sends no payload to parse (no error popup) yet keeps NAT/radio state warm
   * and forces the TCP stack to discover a dead peer — which then fires `close`
   * and triggers the reconnect path. A socket that has already moved to
   * CLOSING/CLOSED without delivering its `close` event is recovered directly.
   */
  private startHeartbeat(socket: WebSocket) {
    this.stopHeartbeat();

    const self = this;
    this.heartbeatTimer = setInterval(function () {
      // Ignore a socket that has already been superseded by a reconnect.
      if (socket !== self.socket) {
        return;
      }

      // CLOSING/CLOSED whose `close` event was never delivered (a half-open
      // socket after the radio slept) — reconnect now instead of waiting.
      if (socket.readyState !== WebSocket.OPEN) {
        self.recover(socket);
        return;
      }

      // Empty keepalive frame: ignored by the backend, no payload to parse.
      try {
        socket.send("");
      } catch (e) {
        self.recover(socket);
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer !== undefined) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  /** Replace a dead socket with a fresh one, neutralising the old one. */
  private recover(deadSocket: WebSocket) {
    if (deadSocket !== this.socket) {
      return;
    }
    this.stopHeartbeat();
    this.connected = false;
    // The stale socket's own `close`/reconnect path is guarded by a
    // `self.socket === socket` check, so closing it here cannot double-connect.
    try {
      deadSocket.close();
    } catch (e) {
      // ignore
    }
    this.socket = this.createWebSocket();
  }

  private createWebSocket(): WebSocket {
    let self = this;
    const socket = new WebSocket(this.url);

    socket.addEventListener("open", function () {
      self.connected = true;
      self.startHeartbeat(socket);

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
      // A superseded socket (replaced by recover()) must not trigger a second
      // reconnect or clobber the live connection's state.
      if (self.socket !== socket) {
        return;
      }
      self.stopHeartbeat();
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
        if (self.socket === socket) {
          self.socket = self.createWebSocket();
        }
      }, 1000);
    });

    socket.addEventListener("message", function (event) {
      let message: WebSocketResponse = JSON.parse(event.data);

      // Diagnostic: confirms the WebView is alive and still receiving reader
      // traffic while backgrounded (e.g. behind SumUp). If these stop after a
      // few minutes, the hidden WebView was frozen by the system.
      console.log("[ws] received", message.type);

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
}
