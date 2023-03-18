import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  MenuItem,
  Paper,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { Link as RLink, useNavigate, useParams } from "react-router-dom";
import { TerminalApp, TerminalAppPage } from "../../terminalApp/TerminalApp";
import { TerminalSettings } from "../../terminalApp/pages/TerminalSettingsPage";
import { SelectAccountPopup } from "../components/account/SelectAccountPopup";
import { AccountDto } from "../../common/contracts";
import { BASE_URL } from "../redux/api/customFetchBase";
import { SimulationClient } from "../../terminalApp/client/SimulationClient";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../../terminalApp/client/AsciiPayAuthenticationClient";
import { useDashboardSelector } from "../redux/dashboardStore";
import { WebSocketClient } from "../../terminalApp/client/WebsocketClient";

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

  const header = (
    <Paper elevation={0}>
      <Box sx={{ px: 1, py: 2, mb: 2 }}>
        <Toolbar disableGutters={true} sx={{ justifyContent: "space-between" }}>
          <div>
            <Typography sx={{ flex: "1 1 100%" }} variant="h5" component="div">
              Terminal emulator
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" component={RLink} to="/">
                ascii-pay
              </Link>
              <Link
                underline="hover"
                color={terminalPage === "start" ? "text.primary" : "inherit"}
                aria-current={terminalPage === "start" ? "page" : undefined}
                component={RLink}
                to="/terminal"
              >
                Terminal
              </Link>
              {terminalPage !== "start" ? (
                <Link
                  underline="hover"
                  color="text.primary"
                  aria-current="page"
                  component={RLink}
                  to={`/terminal/${terminalPage}`}
                >
                  {terminalPage.charAt(0).toUpperCase() +
                    terminalPage.substr(1).toLowerCase()}
                </Link>
              ) : null}
            </Breadcrumbs>
          </div>
        </Toolbar>
      </Box>
    </Paper>
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
