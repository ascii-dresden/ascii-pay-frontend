import React from "react";
import { createRoot } from "react-dom/client";
import { TerminalDeviceContext } from "../../src/terminalApp/client/AsciiPayAuthenticationClient";
import { AndroidApp } from "./AndroidApp";
import { CssBaseline } from "@mui/material";
import { BackgroundMode } from "@awesome-cordova-plugins/background-mode";
import { WebSocketClient } from "../../src/terminalApp/client/WebsocketClient";
import { Kiosk, SUMUP_PACKAGES } from "./kiosk";

const authClient = new WebSocketClient("ws://10.3.141.1:9001/");
// const authClient = new SimulationClient();
const deviceContext: TerminalDeviceContext = {
  wakeUp: () => {
    console.log("[wake] wakeUp() invoked from JS");
    // Native wake/unlock (works on Android 10+/One UI). BackgroundMode.wakeUp()
    // is kept as a best-effort fallback for older devices.
    Kiosk.wake().catch((e) => console.error("Kiosk.wake failed", e));
    try {
      BackgroundMode.wakeUp();
    } catch (e) {
      console.error("BackgroundMode is not available", e);
    }
  },
  openSumUp: () =>
    Kiosk.openApp({ packageNames: SUMUP_PACKAGES })
      .then(() => undefined)
      .catch((e) => {
        console.error("Kiosk.openApp(SumUp) failed", e);
        throw e;
      }),
};

document.addEventListener(
  "deviceready",
  function () {
    try {
      BackgroundMode.enable();
      BackgroundMode.excludeFromTaskList();
      BackgroundMode.overrideBackButton();
      // Keep the websocket alive while the screen is off (Doze / App Standby).
      BackgroundMode.disableBatteryOptimizations();
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
