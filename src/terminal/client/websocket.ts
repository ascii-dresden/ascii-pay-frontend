type RequestNfcRefresh = {
  type: "RequestNfcRefresh";
};
export type WebSocketRequest = RequestNfcRefresh;

type FoundBarcode = {
  type: "FoundBarcode";
  payload: {
    code: string;
  };
};
type FoundSessionToken = {
  type: "FoundSessionToken";
  payload: {
    token: string;
  };
};
type FoundNfcCard = {
  type: "FoundNfcCard";
  payload: {
    id: string;
    name: string;
  };
};
type NfcCardRemoved = {
  type: "NfcCardRemoved";
};
type Error = {
  type: "Error";
  payload: {
    source: string;
    message: string;
  };
};
type ConnectionStateChange = {
  type: "ConnectionStateChange";
  payload: {
    connected: boolean;
  };
};
export type WebSocketResponse =
  | FoundSessionToken
  | FoundBarcode
  | FoundNfcCard
  | NfcCardRemoved
  | Error
  | ConnectionStateChange;

export interface WebSocketMessageHandler {
  onMessage?(message: WebSocketResponse): void | boolean;

  onConnectionStateChange?(connected: boolean): void | boolean;

  onFoundSessionToken?(token: string): void | boolean;

  onFoundBarcode?(code: string): void | boolean;

  onFoundNfcCard?(id: string, name: string): void | boolean;

  onNfcCardRemoved?(): void | boolean;

  onError?(source: string, message: string): void | boolean;
}

export function dispatchWebSocketMessage(
  message: WebSocketResponse,
  handler: WebSocketMessageHandler
) {
  let consumeMessage = handler.onMessage && handler.onMessage(message);
  let consumeType: boolean | void | undefined;
  switch (message.type) {
    case "FoundSessionToken":
      console.log("message", message);
      consumeType =
        (handler.onFoundSessionToken &&
          handler.onFoundSessionToken(message.payload.token)) ||
        consumeType;
      break;
    case "FoundBarcode":
      consumeType =
        (handler.onFoundBarcode &&
          handler.onFoundBarcode(message.payload.code)) ||
        consumeType;
      break;
    case "FoundNfcCard":
      consumeType =
        (handler.onFoundNfcCard &&
          handler.onFoundNfcCard(message.payload.id, message.payload.name)) ||
        consumeType;
      break;
    case "NfcCardRemoved":
      consumeType =
        (handler.onNfcCardRemoved && handler.onNfcCardRemoved()) || consumeType;
      break;
    case "Error":
      consumeType =
        (handler.onError &&
          handler.onError(message.payload.source, message.payload.message)) ||
        consumeType;
      break;
    case "ConnectionStateChange":
      consumeType =
        (handler.onConnectionStateChange &&
          handler.onConnectionStateChange(message.payload.connected)) ||
        consumeType;
      break;
  }

  return !!consumeType || !!consumeMessage;
}
