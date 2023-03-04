import React from "react";
import { useNavigate } from "react-router-dom";
import { SidebarAction, SidebarLayout } from "../components/SidebarLayout";
import { Login } from "../accounts/Login";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../client/AsciiPayAuthenticationClient";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ExitToApp, People, ShowChartOutlined } from "@mui/icons-material";
import { AccountOverview } from "../accounts/AccountOverview";
import { AccountList } from "../accounts/AccountList";
import { AccountDetails } from "../accounts/AccountDetails";
import { TerminalClientMessageHandler } from "../client/websocket";
import { setScreensaver } from "../../redux/features/terminalSlice";
import { receiveAccountSessionToken } from "../../redux/features/paymentSlice";
import { TerminalSettings } from "./TerminalSettingsPage";

const StyledLoggedAccountHeader = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 4.4em;
  background-color: var(--secondary-hover-background);
  padding: 1em;

  span {
    display: block;
    line-height: 1.2em;
  }

  div {
    position: absolute;
    right: 0;
    top: 0;
    width: 4.4em;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 1.8em;
      height: 1.8em;
    }
  }
`;

enum Mode {
  SELF,
  LIST,
}

export const TerminalAccountPage = (props: {
  authClient: AsciiPayAuthenticationClient;
  deviceContext: TerminalDeviceContext;
  height: number;
  fontSize: number;
  settings: TerminalSettings;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [mode, setMode] = React.useState(Mode.SELF);

  const handleGoBack = () => {
    navigate("/terminal");
  };
  const dispatch = useAppDispatch();

  const handler: TerminalClientMessageHandler = {
    onReceiveSessionToken(token: string) {
      props.deviceContext.wakeUp();
      dispatch(setScreensaver(false));
      dispatch(receiveAccountSessionToken(token));
      return true;
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  let [accountId, setAccountId] = React.useState(null as number | null);

  const account = useAppSelector((state) => state.paymentState.scannedAccount);

  if (account === null) {
    return (
      <SidebarLayout defaultAction={handleGoBack}>
        <Login authClient={props.authClient} />
      </SidebarLayout>
    );
  }

  const actions: SidebarAction[] = [
    {
      title: t("account.overview"),
      element: <ShowChartOutlined />,
      action: () => setMode(Mode.SELF),
      active: mode === Mode.SELF,
    },
    {
      title: t("account.accountList"),
      element: <People />,
      action: () => setMode(Mode.LIST),
      active: mode === Mode.LIST,
    },
  ];

  let content;
  switch (mode) {
    case Mode.SELF:
      content = (
        <AccountOverview
          account={account}
          height={props.height}
          fontSize={props.fontSize}
          settings={props.settings}
        />
      );
      break;
    case Mode.LIST:
      content = (
        <>
          <AccountList id={accountId} onSelect={(id) => setAccountId(id)} />
          {accountId ? (
            <AccountDetails
              accountId={accountId}
              authClient={props.authClient}
            />
          ) : (
            <></>
          )}
        </>
      );
      break;
  }

  return (
    <SidebarLayout defaultAction={handleGoBack} content={actions}>
      <StyledLoggedAccountHeader>
        <span>{account.name}</span>
        <span>{account.role}</span>
        <div>
          <ExitToApp />
        </div>
      </StyledLoggedAccountHeader>
      {content}
    </SidebarLayout>
  );
};
