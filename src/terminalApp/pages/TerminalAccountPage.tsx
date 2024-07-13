import React from "react";
import { SidebarAction, SidebarLayout } from "../components/SidebarLayout";
import { Login } from "../accounts/Login";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../client/AsciiPayAuthenticationClient";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import {
  useTerminalDispatch,
  useTerminalSelector,
} from "../redux/terminalStore";
import {
  ExitToApp,
  ManageAccountsOutlined,
  People,
  ShowChartOutlined,
} from "@mui/icons-material";
import { AccountOverview } from "../accounts/AccountOverview";
import { AccountList } from "../accounts/AccountList";
import { AccountDetails } from "../accounts/AccountDetails";
import { TerminalClientMessageHandler } from "../client/websocket";
import { setScreensaver } from "../redux/features/terminalSlice";
import { TerminalSettings } from "./TerminalSettingsPage";
import { terminalLogin, terminalLogout } from "../redux/features/accountSlice";
import { accountApi } from "../redux/api/accountApi";
import { TerminalNavigateHandler } from "../TerminalApp";

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

    &:nth-of-type(1) {
      font-weight: bold;
    }

    &:nth-of-type(2) {
      line-height: 1.4em;
      font-size: 0.9em;
    }
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
      width: 1.2em;
      height: 1.2em;
    }
  }
`;

enum Mode {
  BALANCE,
  SELF_MANAGE,
  ACCOUNT_LIST,
}

export const TerminalAccountPage = (props: {
  authClient: AsciiPayAuthenticationClient;
  deviceContext: TerminalDeviceContext;
  height: number;
  fontSize: number;
  settings: TerminalSettings;
  navigate: TerminalNavigateHandler;
}) => {
  const { t } = useTranslation();
  const dispatch = useTerminalDispatch();

  const account = useTerminalSelector((state) => state.accountState.account);

  const [mode, setMode] = React.useState(Mode.BALANCE);

  const handleGoBack = () => {
    dispatch(accountApi.util.resetApiState());
    dispatch(terminalLogout());
    props.navigate("start");
  };

  const handler: TerminalClientMessageHandler = {
    onReceiveSessionToken(token: string) {
      props.deviceContext.wakeUp();
      dispatch(setScreensaver(false));
      dispatch(terminalLogin(token));
      return true;
    },
  };

  React.useEffect(() => {
    props.authClient.addEventHandler(handler);
    return () => props.authClient.removeEventHandler(handler);
    // eslint-disable-next-line
  }, [props.authClient]);

  let [accountId, setAccountId] = React.useState(null as number | null);

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
      action: () => setMode(Mode.BALANCE),
      active: mode === Mode.BALANCE,
    },
    {
      title: t("account.selfManage"),
      element: <ManageAccountsOutlined />,
      action: () => setMode(Mode.SELF_MANAGE),
      active: mode === Mode.SELF_MANAGE,
    },
  ];

  if (account.role === "Admin") {
    actions.push({
      title: t("account.accountList"),
      element: <People />,
      action: () => setMode(Mode.ACCOUNT_LIST),
      active: mode === Mode.ACCOUNT_LIST,
    });
  }

  let content;
  switch (mode) {
    case Mode.BALANCE:
      content = (
        <AccountOverview
          account={account}
          height={props.height}
          fontSize={props.fontSize}
          settings={props.settings}
        />
      );
      break;
    case Mode.SELF_MANAGE:
      content = (
        <AccountDetails
          fullWidth
          accountId={account.id}
          authClient={props.authClient}
        />
      );
      break;
    case Mode.ACCOUNT_LIST:
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
        <div onClick={handleGoBack}>
          <ExitToApp />
        </div>
      </StyledLoggedAccountHeader>
      {content}
    </SidebarLayout>
  );
};
