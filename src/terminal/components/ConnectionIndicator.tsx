import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { TerminalClientMessageHandler } from "../client/websocket";
import { AsciiPayAuthenticationClient } from "../client/AsciiPayAuthenticationClient";

const StyledConnectionIndicator = styled.div`
  position: absolute;
  top: -0.5em;
  left: 0;
  width: 100%;
  height: 0.4em;
  text-align: center;
  background-color: var(--error-color);
  color: var(--error-text-color);
  z-index: 1000;
  transition: top 0.5s ease 2s, background-color 0.5s, color 0.5s;
  filter: drop-shadow(black 0px 0px 1px);

  display: flex;
  justify-content: center;

  div {
    position: relative;
    top: -1.1em;
    transition: top 0.5s ease 2s, border-color 0.5s;

    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
    border-top: 1.5em solid var(--error-color);
  }

  span {
    height: 1.5em;
    line-height: 1.5em;
    margin-top: -1.5em;
    position: relative;
    display: block;
    width: 14.8em;
    text-align: center;
  }

  &.connected {
    background-color: var(--success-color);
    color: var(--success-text-color);

    div {
      border-top-color: var(--success-color);
    }
  }

  &.disconnected {
    top: 0;
    transition: top 0.5s ease 0s;

    div {
      top: 0;
      transition: top 0.5s ease 0s;
    }
  }
`;

export const ConnectionIndicator = React.memo(
  (props: { authClient: AsciiPayAuthenticationClient }) => {
    const { t } = useTranslation();
    let [isConnected, setIsConnected] = useState(
      props.authClient.isConnected()
    );

    const handler: TerminalClientMessageHandler = {
      onConnectionStateChange(connected: boolean) {
        setIsConnected(connected);
      },
    };

    React.useEffect(() => {
      props.authClient.addFallbackEventHandler(handler);
      return () => props.authClient.addFallbackEventHandler(handler);
      // eslint-disable-next-line
    }, [props.authClient]);

    let message = isConnected
      ? t("general.terminalConnected")
      : t("general.terminalDisconnected");
    return (
      <StyledConnectionIndicator
        className={isConnected ? "connected" : "disconnected"}
      >
        <div>
          <span>{message}</span>
        </div>
      </StyledConnectionIndicator>
    );
  }
);
