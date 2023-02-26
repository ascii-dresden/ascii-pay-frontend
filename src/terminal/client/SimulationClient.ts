import {
  dispatchWebSocketMessage,
  WebSocketMessageHandler,
  WebSocketResponse,
} from "./websocket";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";

export type SimulationClientState = {
  connected: boolean;
  session: string | null;
};

export class SimulationClient implements AsciiPayAuthenticationClient {
  state: SimulationClientState;
  handlerList: WebSocketMessageHandler[];
  fallbackHandlerList: WebSocketMessageHandler[];
  queue: (() => void)[];

  constructor(state: SimulationClientState) {
    this.state = state;
    this.handlerList = [];
    this.fallbackHandlerList = [];
    this.queue = [];
  }

  private dispatch(message: WebSocketResponse) {
    let useFallbackHandler = true;
    for (const handler of this.handlerList) {
      if (dispatchWebSocketMessage(message, handler)) {
        useFallbackHandler = false;
      }
    }

    if (useFallbackHandler) {
      for (const handler of this.fallbackHandlerList) {
        dispatchWebSocketMessage(message, handler);
      }
    }

    for (let q of this.queue) {
      q();
    }

    this.queue = [];
  }

  public isConnected(): boolean {
    return this.state.connected;
  }

  public updateState(state: SimulationClientState) {
    if (this.state.connected !== state.connected) {
      this.state.connected = state.connected;

      this.dispatch({
        type: "ConnectionStateChange",
        payload: {
          connected: state.connected,
        },
      });
    }

    if (this.state.session !== state.session) {
      this.state.session = state.session;

      console.log("Update state", state);
      if (this.state.session === null) {
        this.dispatch({
          type: "NfcCardRemoved",
        });
      } else {
        this.dispatch({
          type: "FoundSessionToken",
          payload: {
            token: this.state.session,
          },
        });
      }
    }
  }

  addEventHandler(handler: WebSocketMessageHandler) {
    this.handlerList.push(handler);
  }

  removeEventHandler(handler: WebSocketMessageHandler) {
    let index = this.handlerList.indexOf(handler);
    while (index >= 0) {
      this.handlerList.splice(index, 1);
      index = this.handlerList.indexOf(handler);
    }
  }

  addFallbackEventHandler(handler: WebSocketMessageHandler) {
    this.fallbackHandlerList.push(handler);
  }

  removeFallbackEventHandler(handler: WebSocketMessageHandler) {
    let index = this.fallbackHandlerList.indexOf(handler);
    while (index >= 0) {
      this.fallbackHandlerList.splice(index, 1);
      index = this.fallbackHandlerList.indexOf(handler);
    }
  }

  requestNfcRefresh() {
    const action = () => {
      if (this.state.session !== null) {
        this.dispatch({
          type: "FoundSessionToken",
          payload: {
            token: this.state.session,
          },
        });
      }
    };

    if (this.state.connected) {
      action();
    } else {
      this.queue.push(action);
    }
  }
}
