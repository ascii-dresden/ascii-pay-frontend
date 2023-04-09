import React from "react";
import { createRoot } from "react-dom/client";
import { TerminalDeviceContext } from "../../src/terminalApp/client/AsciiPayAuthenticationClient";
import { AndroidApp } from "./AndroidApp";
import { CssBaseline } from "@mui/material";
import { BackgroundMode } from "@awesome-cordova-plugins/background-mode";
import { WebSocketClient } from "../../src/terminalApp/client/WebsocketClient";

const authClient = new WebSocketClient("ws://10.3.141.1:9001/");
// const authClient = new SimulationClient();
const deviceContext: TerminalDeviceContext = {
  wakeUp: () => {
    try {
      BackgroundMode.wakeUp();
    } catch (e) {
      console.error("BackgroundMode is not available", e);
    }
  },
};

document.addEventListener(
  "deviceready",
  function () {
    try {
      BackgroundMode.enable();
      BackgroundMode.excludeFromTaskList();
      BackgroundMode.overrideBackButton();
    } catch (e) {
      console.error("BackgroundMode is not available", e);
    }
  },
  false
);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <AndroidApp authClient={authClient} deviceContext={deviceContext} />
  </React.StrictMode>
);
