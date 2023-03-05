import React from "react";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import {
  hideNotification,
  Notification,
  NotificationColor,
  NotificationType,
} from "../redux/features/terminalSlice";
import { InfoOutlined, Payment, QrCode2 } from "@mui/icons-material";
import styled from "@emotion/styled";

const StyledNotifications = styled.div`
  position: absolute;
  z-index: 100;
  top: 1em;
  right: 1em;
  width: 45%;
`;

const StyledNotification = styled.div`
  background-color: var(--primary-background);
  border: solid 1px var(--border-color);

  position: relative;
  width: 100%;
  margin-bottom: 1em;
  padding: 0.8em 0.5em;

  &.notification-warn {
    svg {
      color: var(--warn-color);
    }
  }

  &.notification-error {
    svg {
      color: var(--error-color);
    }
  }
`;

const StyledNotificationIcon = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 3em;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 1.5em;
    height: 1.5em;
  }
`;

const StyledNotificationTitle = styled.div`
  padding-left: 2.5em;
  font-weight: bold;
`;

const StyledNotificationDescription = styled.div`
  padding-left: 2.5em;
  padding-top: 0.5em;

  &:empty {
    padding-top: 0;
  }
`;

export const NotificationManager = () => {
  const notifications = useTerminalSelector(
    (state) => state.terminalState.notifications
  );
  const dispatch = useTerminalDispatch();

  if (!notifications) {
    return <></>;
  }

  const n = notifications.map((n, i) => (
    <NotificationBox
      key={i}
      notification={n}
      onClose={() => dispatch(hideNotification(n))}
    />
  ));

  return <StyledNotifications>{n}</StyledNotifications>;
};

const NotificationBox = (props: {
  notification: Notification;
  onClose: () => void;
}) => {
  let color;
  let icon;
  switch (props.notification.type) {
    case NotificationType.GENERAL:
      icon = <InfoOutlined />;
      break;
    case NotificationType.NFC:
      icon = <Payment />;
      break;
    case NotificationType.QR:
      icon = <QrCode2 />;
      break;
  }
  switch (props.notification.color) {
    case NotificationColor.INFO:
      color = "info";
      break;
    case NotificationColor.WARN:
      color = "warn";
      break;
    case NotificationColor.ERROR:
      color = "error";
      break;
  }

  return (
    <StyledNotification
      className={"notification-" + color}
      onClick={props.onClose}
    >
      <StyledNotificationIcon>{icon}</StyledNotificationIcon>
      <StyledNotificationTitle>
        {props.notification.title}
      </StyledNotificationTitle>
      <StyledNotificationDescription>
        {props.notification.description}
      </StyledNotificationDescription>
    </StyledNotification>
  );
};
