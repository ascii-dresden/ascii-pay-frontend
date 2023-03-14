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
import {
  Done,
  Error,
  InfoOutlined,
  PageviewOutlined,
  Payment,
  QrCode2,
  VerifiedOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import styled from "@emotion/styled";
import clsx from "clsx";

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

  &.small {
    padding: 0.4em 0.2em;
  }

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

  const n = notifications.map((n, i) => {
    if (n.key === "nfc-proxy") {
      return (
        <NotificationNfcProxy
          key={i}
          phase={n.title}
          hasError={n.color === NotificationColor.ERROR}
        />
      );
    }
    return (
      <NotificationBox
        key={i}
        notification={n}
        onClose={() => dispatch(hideNotification(n))}
      />
    );
  });

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

const StyledNotificationNfcProxy = styled.div`
  display: flex;
`;

const StyledNotificationNfcProxyItem = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.2;
  position: relative;

  &.active {
    opacity: 1;
  }

  &.hasError {
    color: var(--error-color);
  }

  & > span {
    display: block;
    font-size: 0.65em;
    margin-top: -0.6em;
  }

  & > .overlay {
    position: absolute;
    top: 50%;
    margin-top: -1.3em;
    left: 50%;
    margin-left: 1em;
    line-height: 1em;
    height: 1em;

    &.load {
      padding-top: 0.1em;

      div {
        border: solid 0.1em var(--primary-text-color);
        border-right-color: transparent;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        animation: rotate 1s infinite linear;
      }
    }

    &.done {
      color: var(--success-color);
    }

    &.error {
      color: var(--error-color);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledNotificationNfcProxyProgress = styled.div`
  position: absolute;
  left: -1px;
  bottom: -1px;
  right: -1px;
  height: 0.2em;

  span {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    background-color: var(--theme-color);
    transition: width 0.2s, background-color 0.2s;

    &.hasError {
      background-color: var(--error-color);
    }
  }
`;

const NotificationNfcProxy = (props: { phase: string; hasError?: boolean }) => {
  let phaseId = 0;
  let progress = 0;
  switch (props.phase) {
    case "identify":
      phaseId = 1;
      progress = 1 / 6;
      break;
    case "challenge":
      phaseId = 2;
      progress = 3 / 6;
      break;
    case "response":
      phaseId = 3;
      progress = 5 / 6;
      break;
    case "finished":
      phaseId = 4;
      progress = 1;
      break;
  }

  progress *= 100;

  return (
    <StyledNotification className="small">
      <StyledNotificationNfcProxy>
        <StyledNotificationNfcProxyItem
          className={clsx({
            active: phaseId >= 1,
            hasError: phaseId === 1 && props.hasError,
          })}
        >
          <div>
            <PageviewOutlined />
          </div>
          <span>Identify</span>
          <NotificationNfcProxyOverlay
            phase={1}
            currentPhase={phaseId}
            hasError={props.hasError}
          />
        </StyledNotificationNfcProxyItem>
        <StyledNotificationNfcProxyItem
          className={clsx({
            active: phaseId >= 2,
            hasError: phaseId === 2 && props.hasError,
          })}
        >
          <div>
            <VpnKeyOutlined />
          </div>
          <span>Challenge</span>
          <NotificationNfcProxyOverlay
            phase={2}
            currentPhase={phaseId}
            hasError={props.hasError}
          />
        </StyledNotificationNfcProxyItem>
        <StyledNotificationNfcProxyItem
          className={clsx({
            active: phaseId >= 3,
            hasError: phaseId === 3 && props.hasError,
          })}
        >
          <div>
            <VerifiedOutlined />
          </div>
          <span>Response</span>
          <NotificationNfcProxyOverlay
            phase={3}
            currentPhase={phaseId}
            hasError={props.hasError}
          />
        </StyledNotificationNfcProxyItem>
        <StyledNotificationNfcProxyProgress>
          <span
            style={{ width: progress + "%" }}
            className={clsx({
              hasError: props.hasError,
            })}
          ></span>
        </StyledNotificationNfcProxyProgress>
      </StyledNotificationNfcProxy>
    </StyledNotification>
  );
};

const NotificationNfcProxyOverlay = (props: {
  phase: number;
  currentPhase: number;
  hasError?: boolean;
}) => {
  if (props.currentPhase === props.phase && !props.hasError) {
    return (
      <div className="overlay load">
        <div></div>
      </div>
    );
  }
  if (props.currentPhase > props.phase) {
    return (
      <div className="overlay done">
        <Done />
      </div>
    );
  }
  if (props.currentPhase === props.phase && props.hasError) {
    return (
      <div className="overlay error">
        <Error />
      </div>
    );
  }

  return null;
};
