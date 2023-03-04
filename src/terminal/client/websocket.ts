import { CardTypeDto } from "../../redux/api/contracts";

type NfcIdentifyResponse = {
  type: "NfcIdentifyResponse";
  payload: {
    card_id: string;
    card_type: CardTypeDto;
  };
};
type NfcChallengeResponse = {
  type: "NfcChallengeResponse";
  payload: {
    card_id: string;
    challenge: string;
  };
};
type NfcResponseResponse = {
  type: "NfcResponseResponse";
  payload: {
    card_id: string;
    session_key: string;
  };
};
type NfcRegister = {
  type: "NfcRegister";
  payload: {
    card_id: string;
  };
};
type NfcReauthenticate = {
  type: "NfcReauthenticate";
};
export type WebSocketRequest =
  | NfcIdentifyResponse
  | NfcChallengeResponse
  | NfcResponseResponse
  | NfcRegister
  | NfcReauthenticate;

type BarcodeIdentifyRequest = {
  type: "BarcodeIdentifyRequest";
  payload: {
    barcode: string;
  };
};
type NfcIdentifyRequest = {
  type: "NfcIdentifyRequest";
  payload: {
    card_id: string;
    name: string;
  };
};
type NfcChallengeRequest = {
  type: "NfcChallengeRequest";
  payload: {
    card_id: string;
    request: string;
  };
};
type NfcResponseRequest = {
  type: "NfcResponseRequest";
  payload: {
    card_id: string;
    challenge: string;
    response: string;
  };
};
type NfcCardRemoved = {
  type: "NfcCardRemoved";
};
type NfcRegisterRequest = {
  type: "NfcRegisterRequest";
  payload: {
    name: string;
    card_id: string;
    card_type: CardTypeDto;
    data?: string | null | undefined;
  };
};
type Error = {
  type: "Error";
  payload: {
    source: string;
    message: string;
  };
};
type ReceiveSessionToken = {
  type: "ReceiveSessionToken";
  payload: {
    token: string;
  };
};
type ReceiveUnregisteredNfcCard = {
  type: "ReceiveUnregisteredNfcCard";
  payload: {
    card_id: string;
    name: string;
  };
};
type ConnectionStateChange = {
  type: "ConnectionStateChange";
  payload: {
    connected: boolean;
  };
};
export type WebSocketResponse =
  | BarcodeIdentifyRequest
  | NfcIdentifyRequest
  | NfcChallengeRequest
  | NfcResponseRequest
  | NfcCardRemoved
  | NfcRegisterRequest
  | Error
  | ConnectionStateChange
  | ReceiveSessionToken
  | ReceiveUnregisteredNfcCard;

export interface TerminalClientMessageHandler {
  onMessage?(message: WebSocketResponse): void | boolean;

  onConnectionStateChange?(connected: boolean): void | boolean;

  onReceiveSessionToken?(token: string): void | boolean;

  onReceiveUnregisteredNfcCard?(name: string, card_id: string): void | boolean;

  onError?(source: string, message: string): void | boolean;

  onBarcodeIdentifyRequest?(barcode: string): void | boolean;

  onNfcIdentifyRequest?(card_id: string, name: string): void | boolean;

  onNfcChallengeRequest?(card_id: string, request: string): void | boolean;

  onNfcResponseRequest?(
    card_id: string,
    challenge: string,
    response: string
  ): void | boolean;

  onNfcCardRemoved?(): void | boolean;

  onNfcRegisterRequest?(
    name: string,
    card_id: string,
    card_type: CardTypeDto,
    data: string | null | undefined
  ): void | boolean;
}

export function dispatchClientMessage(
  message: WebSocketResponse,
  handler: TerminalClientMessageHandler
) {
  let consumeMessage = handler.onMessage && handler.onMessage(message);
  let consumeType: boolean | void | undefined;
  switch (message.type) {
    case "BarcodeIdentifyRequest":
      consumeType =
        (handler.onBarcodeIdentifyRequest &&
          handler.onBarcodeIdentifyRequest(message.payload.barcode)) ||
        consumeType;
      break;
    case "NfcIdentifyRequest":
      consumeType =
        (handler.onNfcIdentifyRequest &&
          handler.onNfcIdentifyRequest(
            message.payload.card_id,
            message.payload.name
          )) ||
        consumeType;
      break;
    case "NfcChallengeRequest":
      consumeType =
        (handler.onNfcChallengeRequest &&
          handler.onNfcChallengeRequest(
            message.payload.card_id,
            message.payload.request
          )) ||
        consumeType;
      break;
    case "NfcResponseRequest":
      consumeType =
        (handler.onNfcResponseRequest &&
          handler.onNfcResponseRequest(
            message.payload.card_id,
            message.payload.challenge,
            message.payload.response
          )) ||
        consumeType;
      break;
    case "NfcCardRemoved":
      consumeType =
        (handler.onNfcCardRemoved && handler.onNfcCardRemoved()) || consumeType;
      break;
    case "NfcRegisterRequest":
      consumeType =
        (handler.onNfcRegisterRequest &&
          handler.onNfcRegisterRequest(
            message.payload.name,
            message.payload.card_id,
            message.payload.card_type,
            message.payload.data
          )) ||
        consumeType;
      break;
    case "Error":
      consumeType =
        (handler.onError &&
          handler.onError(message.payload.source, message.payload.message)) ||
        consumeType;
      break;
    case "ReceiveSessionToken":
      consumeType =
        (handler.onReceiveSessionToken &&
          handler.onReceiveSessionToken(message.payload.token)) ||
        consumeType;
      break;
    case "ReceiveUnregisteredNfcCard":
      consumeType =
        (handler.onReceiveUnregisteredNfcCard &&
          handler.onReceiveUnregisteredNfcCard(
            message.payload.name,
            message.payload.card_id
          )) ||
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
