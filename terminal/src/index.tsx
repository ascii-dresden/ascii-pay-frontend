import React from "react";
import { createRoot } from "react-dom/client";
import { TerminalDeviceContext } from "../../src/terminalApp/client/AsciiPayAuthenticationClient";
import { AndroidApp } from "./AndroidApp";
import { BrowserRouter as Router } from "react-router-dom";
import { SimulationClient } from "../../src/terminalApp/client/SimulationClient";
import { CssBaseline } from "@mui/material";

// const authClient = new WebSocketClient("ws://localhost:9001/");
const authClient = new SimulationClient();
const deviceContext: TerminalDeviceContext = {
  wakeUp: () => {},
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>
      <AndroidApp authClient={authClient} deviceContext={deviceContext} />
    </Router>
  </React.StrictMode>
);
