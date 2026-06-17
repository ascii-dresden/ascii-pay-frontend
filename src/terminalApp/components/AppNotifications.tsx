import {
  NotificationColor,
  NotificationType,
  showNotification,
} from "../redux/features/terminalSlice";
import { useTerminalDispatch } from "../redux/terminalStore";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../client/AsciiPayAuthenticationClient";
import { TerminalClientMessageHandler } from "../client/websocket";

export const AppNotifications = React.memo(
  (props: {
    authClient: AsciiPayAuthenticationClient;
    deviceContext: TerminalDeviceContext;
  }) => {
    const dispatch = useTerminalDispatch();
    const { t } = useTranslation();

    React.useEffect(() => {
      const handler: TerminalClientMessageHandler = {
        onMessage(message) {
          // Only pull the terminal to the foreground for a *valid* card or a
          // deliberate input — never for a raw NFC read. A random/unregistered tag
          // produces these protocol messages but never authenticates, so it must not
          // force the app over whatever is currently on screen. A valid card finishes
          // the handshake with a ReceiveSessionToken, which still wakes the app via
          // the default branch (and the per-page handlers).
          switch (message.type) {
            case "NfcIdentifyRequest":
            case "NfcChallengeRequest":
            case "NfcResponseRequest":
            case "NfcCardRemoved":
            case "ReceiveUnregisteredNfcCard":
              return;
            default:
              props.deviceContext.wakeUp();
          }
        },
        onBarcodeIdentifyRequest(barcode: string): void | boolean {
          dispatch(
            showNotification({
              type: NotificationType.QR,
              title: t("notification.onFoundBarcode"),
              description: barcode,
            })
          );
        },
        onReceiveUnregisteredNfcCard(
          name: string,
          card_id: string
        ): void | boolean {
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: null,
              description: name,
              key: "nfc-proxy",
            })
          );
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: t("notification.onFoundNfcCard"),
              description: name,
            })
          );
        },
        onReceiveSessionToken(token: string): void | boolean {
          dispatch(
            showNotification({
              type: NotificationType.GENERAL,
              title: t("notification.onFoundSessionToken"),
            })
          );
        },
        onNfcCardRemoved() {
          dispatch(
            showNotification({
              type: NotificationType.NFC,
              title: t("notification.onNfcCardRemoved"),
            })
          );
        },
        onError(source: string, message: string) {
          dispatch(
            showNotification({
              type: NotificationType.GENERAL,
              color: NotificationColor.ERROR,
              title: source,
              description: message,
            })
          );
        },
      };

      props.authClient.addFallbackEventHandler(handler);
      return () => props.authClient.removeFallbackEventHandler(handler);
      // eslint-disable-next-line
    }, [props.authClient]);

    return <div></div>;
  }
);
