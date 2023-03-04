import { TerminalClientMessageHandler } from "./websocket";
import { CardTypeDto } from "../../redux/api/contracts";

export interface AsciiPayAuthenticationClient {
  isConnected: () => boolean;

  addEventHandler: (handler: TerminalClientMessageHandler) => void;
  removeEventHandler: (handler: TerminalClientMessageHandler) => void;

  addFallbackEventHandler: (handler: TerminalClientMessageHandler) => void;
  removeFallbackEventHandler: (handler: TerminalClientMessageHandler) => void;

  requestNfcIdentifyResponse: (card_id: string, card_type: CardTypeDto) => void;
  requestNfcChallengeResponse: (card_id: string, challenge: string) => void;
  requestNfcResponseResponse: (card_id: string, session_key: string) => void;
  requestNfcRegister: (card_id: string) => void;
  requestNfcReauthenticate: () => void;

  receiveSessionToken: (token: string) => void;
  receiveUnregisteredNfcCard: (name: string, card_id: string) => void;
}

export interface TerminalDeviceContext {
  wakeUp: () => void;
}
