import { SidebarAction, SidebarLayout } from "../components/SidebarLayout";
import { useTerminalDispatch } from "../redux/terminalStore";
import React from "react";
import {
  LocalAtm,
  People,
  Settings,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { setScreensaver } from "../redux/features/terminalSlice";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { ClockIcon } from "../components/ClockIcon";
import { TerminalClientMessageHandler } from "../client/websocket";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../client/AsciiPayAuthenticationClient";
import { receiveAccountSessionToken } from "../redux/features/paymentSlice";
import { TerminalNavigateHandler } from "../TerminalApp";

const StyledStartPage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const StyledStartPageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.4em;
  line-height: 3em;
  padding: 0.4em 1.2em 0.4em 1em;

  & > span {
    display: block;
  }
`;

const StyledStartPageMenu = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  top: 4em;
  bottom: 0;
  display: grid;
  grid-template:
    "1 2"
    "3 4";
  grid-gap: 0.6em;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  padding: 0.4em;
`;

const StyledStartPageEntry = styled.div`
  position: relative;
  background-color: var(--primary-background);
  border: solid 1px var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    width: 4em;
    height: 4em;
    opacity: 0.87;
  }

  span {
    padding-top: 1em;
    font-size: 1.2em;
  }

  &:hover {
    background-color: var(--primary-hover-background);
  }

  &.inactive {
    opacity: 0.5;

    & > * {
      opacity: 0.3;
    }

    &:hover {
      background-color: var(--primary-background);
    }
  }
`;

const useDate = (t: (key: string) => string) => {
  const locale = localStorage.getItem("language") ?? "de";
  const [today, setDate] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 5 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: "short" });
  const date = `${day} ${today.getDate()}. ${today.toLocaleDateString(locale, {
    month: "short",
  })}`;
  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  });

  const hour = today.getHours();
  const wish = t(
    (hour < 12 && "startPage.greeting.morning") ||
      (hour < 17 && "startPage.greeting.day") ||
      "startPage.greeting.evening"
  );

  return {
    date: `${date} ${time}`,
    wish,
  };
};

export const TerminalStartPage = (props: {
  authClient: AsciiPayAuthenticationClient;
  deviceContext: TerminalDeviceContext;
  navigate: TerminalNavigateHandler;
}) => {
  const { t } = useTranslation();

  const dispatch = useTerminalDispatch();
  const { date, wish } = useDate(t);

  const handler: TerminalClientMessageHandler = {
    onReceiveSessionToken(token: string) {
      props.deviceContext.wakeUp();
      dispatch(setScreensaver(false));
      dispatch(receiveAccountSessionToken(token));
      props.navigate("payment");
      return true;
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  const sidebarActions: SidebarAction[] = [
    {
      title: t("general.enableScreensaver"),
      element: <ClockIcon />,
      action: (event) => {
        event.stopPropagation();
        dispatch(setScreensaver(true));
      },
      bottom: true,
    },
  ];
  return (
    <SidebarLayout content={sidebarActions}>
      <StyledStartPage>
        <StyledStartPageHeader>
          <span>{wish}</span>
          <span>{date}</span>
        </StyledStartPageHeader>
        <StyledStartPageMenu>
          <StyledStartPageEntry onClick={() => props.navigate("payment")}>
            <ShoppingCartOutlined />
            <span>{t("startPage.openPayment")}</span>
          </StyledStartPageEntry>
          <StyledStartPageEntry onClick={() => props.navigate("register")}>
            <LocalAtm />
            <span>{t("startPage.openRegister")}</span>
          </StyledStartPageEntry>
          <StyledStartPageEntry onClick={() => props.navigate("accounts")}>
            <People />
            <span>{t("startPage.openAccount")}</span>
          </StyledStartPageEntry>
          <StyledStartPageEntry onClick={() => props.navigate("settings")}>
            <Settings />
            <span>{t("startPage.openSettings")}</span>
          </StyledStartPageEntry>
        </StyledStartPageMenu>
      </StyledStartPage>
    </SidebarLayout>
  );
};
