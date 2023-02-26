import { WebSocketMessageHandler } from "./websocket";

export interface AsciiPayAuthenticationClient {
  isConnected: () => boolean;
  addEventHandler: (handler: WebSocketMessageHandler) => void;

  removeEventHandler: (handler: WebSocketMessageHandler) => void;

  addFallbackEventHandler: (handler: WebSocketMessageHandler) => void;

  removeFallbackEventHandler: (handler: WebSocketMessageHandler) => void;

  requestNfcRefresh: () => void;
}

export interface TerminalDeviceContext {
  wakeUp: () => void;
}
