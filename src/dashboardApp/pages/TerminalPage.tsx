import {
  Box,
  Button,
  ButtonGroup,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TerminalApp, TerminalAppPage } from "../../terminalApp/TerminalApp";
import { TerminalSettings } from "../../terminalApp/pages/TerminalSettingsPage";
import { SelectAccountPopup } from "../components/account/SelectAccountPopup";
import { AccountDto } from "../../common/contracts";
import { SimulationClient } from "../../terminalApp/client/SimulationClient";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../../terminalApp/client/AsciiPayAuthenticationClient";
import { useDashboardSelector } from "../redux/dashboardStore";
import { WebSocketClient } from "../../terminalApp/client/WebsocketClient";
import { ReceiveKeyboardEventKey } from "../../terminalApp/client/websocket";
import {
  BackspaceOutlined,
  KeyboardReturnOutlined,
  Remove,
} from "@mui/icons-material";
import { usePageTitle } from "../components/usePageTitle";
import { BASE_URL } from "../../const";
import { PageHeader, PageHeaderNavigation } from "../components/PageHeader";

type ConnectionSimulateState = {
  connected: boolean;
  session: string | null;
};

function requestAccountSession(
  token: string | null,
  account: AccountDto,
  setSession: (session: string | null) => void
) {
  fetch(`${BASE_URL}/auth/nfc/simulation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      account_id: account.id,
    }),
  })
    .then((response) => response.json())
    .then((response) => setSession(response.token ?? null))
    .catch(() => setSession(null));
}

const keys: ReceiveKeyboardEventKey[] = [
  "NUM_1",
  "NUM_2",
  "NUM_3",
  "NUM_4",
  "NUM_5",
  "NUM_6",
  "NUM_7",
  "NUM_8",
  "NUM_9",
  "NUM_0",
  "NEGATE",
  "BACKSPACE",
  "ENTER",
];

export const TerminalPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const token = useDashboardSelector((state) => state.userState.token);

  const [width, setWidth] = React.useState("1000");
  const [height, setHeight] = React.useState("625");
  const [connectionMode, setConnectionMode] = React.useState("simulate");
  const [connectionSimulateState, setConnectionSimulateState] =
    React.useState<ConnectionSimulateState>({
      connected: true,
      session: null,
    });
  const [connectionWebSocketUrl, setConnectionWebSocketUrl] = React.useState(
    "ws://localhost:9001/"
  );

  usePageTitle("Terminal");

  const [authClient, setAuthClient] =
    React.useState<AsciiPayAuthenticationClient>(
      new SimulationClient(connectionSimulateState)
    );

  React.useEffect(() => {
    if (
      connectionMode === "simulate" &&
      !(authClient as SimulationClient).updateState
    ) {
      setAuthClient(new SimulationClient(connectionSimulateState));
    }
    if (
      connectionMode !== "simulate" &&
      (authClient as SimulationClient).updateState
    ) {
      setAuthClient(new WebSocketClient(connectionWebSocketUrl));
    }
  }, [connectionMode, connectionWebSocketUrl]);

  const [settings, setSettings] = React.useState<TerminalSettings>({
    language: "en",
    theme: theme.palette.mode,
    highlightColor: "green",
  });

  const deviceContext = React.useMemo(() => {
    let context: TerminalDeviceContext = {
      wakeUp: () => {},
    };
    return context;
  }, []);

  React.useEffect(() => {
    if ((authClient as SimulationClient).updateState) {
      (authClient as SimulationClient).updateState(connectionSimulateState);
    }
  }, [connectionSimulateState, authClient]);

  let terminalPage: TerminalAppPage = "start";
  switch (params.page) {
    case "payment":
      terminalPage = "payment";
      break;
    case "register":
      terminalPage = "register";
      break;
    case "accounts":
      terminalPage = "accounts";
      break;
    case "settings":
      terminalPage = "settings";
      break;
  }

  const setTerminalPage = (page: TerminalAppPage) => {
    if (page === "start") {
      navigate("/terminal");
    } else {
      navigate(`/terminal/${page}`);
    }
  };

  let navigation: PageHeaderNavigation[] = [
    {
      label: "Terminal",
      target: "/terminal",
    },
  ];

  if (terminalPage !== "start") {
    navigation.push({
      label:
        terminalPage.charAt(0).toUpperCase() +
        terminalPage.substr(1).toLowerCase(),
      target: `/terminal/${terminalPage}`,
    });
  }

  const header = (
    <PageHeader navigation={navigation}>
      <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
        Terminal emulator
      </Typography>
    </PageHeader>
  );

  let connectionBox;
  if (connectionMode === "simulate") {
    const selectAccount = (account: AccountDto) =>
      requestAccountSession(token, account, (token) => {
        setConnectionSimulateState((s) => {
          return {
            ...s,
            session: token,
          };
        });
      });
    const removeSession = () =>
      setConnectionSimulateState((s) => {
        return {
          ...s,
          session: null,
        };
      });
    const toggleConnected = () =>
      setConnectionSimulateState((s) => {
        return {
          ...s,
          connected: !s.connected,
        };
      });

    const sendKeyboardEvent = (key: ReceiveKeyboardEventKey) => {
      if (
        connectionMode === "simulate" &&
        (authClient as SimulationClient).updateState
      ) {
        (authClient as SimulationClient).sendKeyboardEvent(key);
      }
    };

    const numpad = keys.map((k) => {
      let name: any = k.replace("NUM_", "");
      switch (k) {
        case "ENTER":
          name = <KeyboardReturnOutlined />;
          break;
        case "BACKSPACE":
          name = <BackspaceOutlined />;
          break;
        case "NEGATE":
          name = <Remove />;
          break;
      }
      return (
        <Button variant="outlined" key={k} onClick={() => sendKeyboardEvent(k)}>
          {name}
        </Button>
      );
    });

    connectionBox = (
      <Box sx={{ mt: 2, display: "flex", "& > *": { mr: "8px !important" } }}>
        {connectionSimulateState.session === null ? (
          <SelectAccountPopup
            label="Select account"
            selectAccount={selectAccount}
          />
        ) : (
          <Button variant="outlined" size="large" onClick={removeSession}>
            Remove account
          </Button>
        )}
        <Button variant="outlined" size="large" onClick={toggleConnected}>
          {connectionSimulateState.connected ? "Disconnect" : "Connect"}
        </Button>
        <ButtonGroup>{numpad}</ButtonGroup>
      </Box>
    );
  } else {
    const connectWebSocket = () => {
      setAuthClient(new WebSocketClient(connectionWebSocketUrl));
    };

    connectionBox = (
      <Box sx={{ mt: 2, display: "flex", "& > *": { mr: "8px !important" } }}>
        <TextField
          label="WebSocket address"
          value={connectionWebSocketUrl}
          onChange={(e) => setConnectionWebSocketUrl(e.target.value)}
        />
        <Button variant="outlined" size="large" onClick={connectWebSocket}>
          Connect
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg">{header}</Container>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={4}
          sx={{
            width: `${width}px`,
            height: `${height}px`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <TerminalApp
            page={terminalPage}
            width={parseInt(width)}
            height={parseInt(height)}
            settings={settings}
            setSettings={setSettings}
            authClient={authClient}
            deviceContext={deviceContext}
            navigate={setTerminalPage}
          />
        </Paper>
      </Box>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ m: 4, px: 1, py: 2 }}>
          <Box sx={{ display: "flex" }}>
            <TextField
              label="Width"
              fullWidth
              sx={{ mr: "0.4rem" }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              label="Height"
              fullWidth
              sx={{ mx: "0.4rem" }}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              select
              label="Connection mode"
              fullWidth
              sx={{ ml: "0.4rem" }}
              value={connectionMode}
              onChange={(e) => setConnectionMode(e.target.value)}
            >
              <MenuItem value="simulate">Simulate terminal</MenuItem>
              <MenuItem value="connect">Connect to terminal</MenuItem>
            </TextField>
          </Box>
          {connectionBox}
        </Paper>
      </Container>
    </>
  );
};
