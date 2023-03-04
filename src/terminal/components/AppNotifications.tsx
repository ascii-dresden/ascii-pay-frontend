import {
  NotificationColor,
  NotificationType,
  showNotification,
} from "../../redux/features/terminalSlice";
import { useAppDispatch } from "../../redux/store";
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
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const handler: TerminalClientMessageHandler = {
      onMessage() {
        props.deviceContext.wakeUp();
      },
      onFoundBarcode(code: string) {
        dispatch(
          showNotification({
            type: NotificationType.QR,
            title: t("notification.onFoundBarcode"),
            description: code,
          })
        );
      },
      onFoundNfcCard(id: string, name: string) {
        dispatch(
          showNotification({
            type: NotificationType.NFC,
            title: t("notification.onFoundNfcCard"),
            description: name,
          })
        );
      },
      onFoundSessionToken() {
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

    React.useEffect(() => {
      props.authClient.addFallbackEventHandler(handler);
      return () => props.authClient.removeFallbackEventHandler(handler);
      // eslint-disable-next-line
    }, [props.authClient]);

    return <div></div>;
  }
);
