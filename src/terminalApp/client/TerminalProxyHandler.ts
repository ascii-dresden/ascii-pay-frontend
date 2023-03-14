import { TerminalClientMessageHandler } from "./websocket";
import { AsciiPayAuthenticationClient } from "./AsciiPayAuthenticationClient";
import { BASE_URL } from "../redux/api/customFetchBase";
import {
  NotificationColor,
  NotificationType,
  showNotification,
} from "../redux/features/terminalSlice";
import { TerminalDispatch } from "../redux/terminalStore";

export function createTerminalProxyHandler(
  dispatch: TerminalDispatch,
  authClient: AsciiPayAuthenticationClient
): TerminalClientMessageHandler {
  return {
    onNfcIdentifyRequest(card_id: string, name: string): void | boolean {
      dispatch(
        showNotification({
          type: NotificationType.NFC,
          title: "Identify ...",
          color: NotificationColor.INFO,
          key: "nfc-proxy",
        })
      );
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
          if (response.card_id && response.card_type) {
            dispatch(
              showNotification({
                type: NotificationType.NFC,
                title: "Challenge ...",
                color: NotificationColor.INFO,
                key: "nfc-proxy",
              })
            );
            authClient.requestNfcIdentifyResponse(
              response.card_id,
              response.card_type
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
              key: "nfc-proxy",
            })
          )
        );
    },
    onNfcChallengeRequest(card_id: string, request: string): void | boolean {
      dispatch(
        showNotification({
          type: NotificationType.NFC,
          title: "Challenge ...",
          color: NotificationColor.INFO,
          key: "nfc-proxy",
        })
      );
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
          if (response.card_id && response.challenge) {
            dispatch(
              showNotification({
                type: NotificationType.NFC,
                title: "Response ...",
                color: NotificationColor.INFO,
                key: "nfc-proxy",
              })
            );
            authClient.requestNfcChallengeResponse(
              response.card_id ?? "",
              response.challenge ?? ""
            );
          } else {
            dispatch(
              showNotification({
                type: NotificationType.NFC,
                title: "Communication error!",
                color: NotificationColor.ERROR,
                key: "nfc-proxy",
              })
            );
          }
        })
        .catch(() =>
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: "Communication error!",
              color: NotificationColor.ERROR,
              key: "nfc-proxy",
            })
          )
        );
    },
    onNfcResponseRequest(
      card_id: string,
      challenge: string,
      response: string
    ): void | boolean {
      dispatch(
        showNotification({
          type: NotificationType.NFC,
          title: "Response ...",
          color: NotificationColor.INFO,
          key: "nfc-proxy",
        })
      );
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
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: null,
              color: NotificationColor.INFO,
              key: "nfc-proxy",
            })
          );
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
              key: "nfc-proxy",
            })
          )
        );
    },
  };
}
