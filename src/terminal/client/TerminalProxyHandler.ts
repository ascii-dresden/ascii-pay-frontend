import { TerminalClientMessageHandler } from "./websocket";
import { AppDispatch } from "../../redux/store";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";
import { BASE_URL } from "../../redux/api/customFetchBase";
import {
  NotificationColor,
  NotificationType,
  showNotification,
} from "../../redux/features/terminalSlice";

export function createTerminalProxyHandler(
  dispatch: AppDispatch,
  authClient: AsciiPayAuthenticationClient
): TerminalClientMessageHandler {
  return {
    onNfcIdentifyRequest(card_id: string, name: string): void | boolean {
      fetch(`${BASE_URL}/auth/nfc/identify`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_id: card_id,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.card_type) {
            authClient.requestNfcIdentifyResponse(
              response.card_id ?? "",
              response.card_type ?? ""
            );
          } else {
            authClient.receiveUnregisteredNfcCard(name, card_id);
          }
        })
        .catch(() =>
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: "Communication error!",
              color: NotificationColor.ERROR,
            })
          )
        );
    },
    onNfcChallengeRequest(card_id: string, request: string): void | boolean {
      fetch(`${BASE_URL}/auth/nfc/challenge`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_id,
          request,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          authClient.requestNfcChallengeResponse(
            response.card_id ?? "",
            response.challenge ?? ""
          );
        })
        .catch(() =>
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: "Communication error!",
              color: NotificationColor.ERROR,
            })
          )
        );
    },
    onNfcResponseRequest(
      card_id: string,
      challenge: string,
      response: string
    ): void | boolean {
      fetch(`${BASE_URL}/auth/nfc/response`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          card_id,
          challenge,
          response,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          authClient.requestNfcResponseResponse(
            response.card_id ?? "",
            response.session_key ?? ""
          );
          if (response.token) {
            authClient.receiveSessionToken(response.token);
          }
        })
        .catch(() =>
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: "Communication error!",
              color: NotificationColor.ERROR,
            })
          )
        );
    },
  };
}
