import {
  dispatchClientMessage,
  ReceiveKeyboardEventKey,
  TerminalClientMessageHandler,
  WebSocketResponse,
} from "./websocket";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";
import { CardTypeDto } from "../../common/contracts";

export type SimulationClientState = {
  connected: boolean;
  session: string | null;
};

export class SimulationClient implements AsciiPayAuthenticationClient {
  state: SimulationClientState;
  handlerList: TerminalClientMessageHandler[];
  fallbackHandlerList: TerminalClientMessageHandler[];
  queue: (() => void)[];

  constructor(state?: SimulationClientState) {
    this.state = state ?? {
      connected: true,
      session: null,
    };
    this.handlerList = [];
    this.fallbackHandlerList = [];
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

      if (this.state.session === null) {
        this.dispatch({
          type: "NfcCardRemoved",
        });
      } else {
        this.dispatch({
          type: "ReceiveSessionToken",
          payload: {
            token: this.state.session,
          },
        });
      }
    }
  }

  addEventHandler(handler: TerminalClientMessageHandler) {
    this.handlerList.push(handler);
  }

  removeEventHandler(handler: TerminalClientMessageHandler) {
    let index = this.handlerList.indexOf(handler);
    while (index >= 0) {
      this.handlerList.splice(index, 1);
      index = this.handlerList.indexOf(handler);
    }
  }

  addFallbackEventHandler(handler: TerminalClientMessageHandler) {
    this.fallbackHandlerList.push(handler);
  }

  removeFallbackEventHandler(handler: TerminalClientMessageHandler) {
    let index = this.fallbackHandlerList.indexOf(handler);
    while (index >= 0) {
      this.fallbackHandlerList.splice(index, 1);
      index = this.fallbackHandlerList.indexOf(handler);
    }
  }

  requestNfcIdentifyResponse(card_id: string, card_type: CardTypeDto): void {
    console.log("requestNfcIdentifyResponse", card_id, card_type);
  }

  requestNfcChallengeResponse(card_id: string, challenge: string): void {
    console.log("requestNfcChallengeResponse", card_id, challenge);
  }

  requestNfcResponseResponse(card_id: string, session_key: string): void {
    console.log("requestNfcResponseResponse", card_id, session_key);
  }

  requestNfcRegister(card_id: string): void {
    console.log("requestNfcRegister", card_id);
  }

  requestNfcReauthenticate() {
    const action = () => {
      if (this.state.session !== null) {
        this.dispatch({
          type: "ReceiveSessionToken",
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

  receiveSessionToken(token: string): void {
    this.dispatch(
      {
        type: "ReceiveSessionToken",
        payload: {
          token,
        },
      },
      true
    );
  }

  receiveUnregisteredNfcCard(name: string, card_id: string): void {
    this.dispatch(
      {
        type: "ReceiveUnregisteredNfcCard",
        payload: {
          name,
          card_id,
        },
      },
      true
    );
  }

  sendKeyboardEvent(key: ReceiveKeyboardEventKey) {
    this.dispatch({
      type: "ReceiveKeyboardEvent",
      payload: {
        key: key,
      },
    });
  }

  private dispatch(message: WebSocketResponse, preventQueueDispatch?: boolean) {
    let useFallbackHandler = true;
    for (const handler of this.handlerList) {
      if (dispatchClientMessage(message, handler)) {
        useFallbackHandler = false;
      }
    }

    if (useFallbackHandler) {
      for (const handler of this.fallbackHandlerList) {
        dispatchClientMessage(message, handler);
      }
    }

    if (preventQueueDispatch) {
      return;
    }

    for (let q of this.queue) {
      q();
    }

    this.queue = [];
  }
}
