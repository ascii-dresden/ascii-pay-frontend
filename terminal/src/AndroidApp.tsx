import React, { useEffect } from "react";
import { TerminalSettings } from "../../src/terminalApp/pages/TerminalSettingsPage";
import {
  TerminalApp,
  TerminalAppPage,
} from "../../src/terminalApp/TerminalApp";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "../../src/terminalApp/client/AsciiPayAuthenticationClient";
import { AndroidFullScreen } from "@awesome-cordova-plugins/android-full-screen";

export const AndroidApp = (props: {
  authClient: AsciiPayAuthenticationClient;
  deviceContext: TerminalDeviceContext;
}) => {
  const [terminalPage, setTerminalPage] =
    React.useState<TerminalAppPage>("start");

  const [width, setWidth] = React.useState("1000");
  const [height, setHeight] = React.useState("625");

  const [settings, setSettings] = React.useState<TerminalSettings>({
    language: localStorage["language"] ?? "en",
    theme: localStorage["theme"] ?? "light",
    highlightColor: localStorage["highlightColor"] ?? "green",
  });

  (async () => {
    try {
      if (await AndroidFullScreen.isImmersiveModeSupported()) {
        await AndroidFullScreen.immersiveMode();
      }
    } catch (e) {
      console.error("AndroidFullScreen is not available", e);
    }
  })();

  React.useEffect(() => {
    localStorage["language"] = settings.language;
    localStorage["theme"] = settings.theme;
    localStorage["highlightColor"] = settings.highlightColor;
  }, [settings]);

  const onresize = () => {
    setWidth(window.innerWidth.toString());
    setHeight(window.innerHeight.toString());
  };

  useEffect(() => {
    onresize();
    window.addEventListener("resize", onresize);
    return () => {
      window.removeEventListener("resize", onresize);
    };
  }, []);

  return (
    <TerminalApp
      page={terminalPage}
      navigate={setTerminalPage}
      width={parseInt(width)}
      height={parseInt(height)}
      settings={settings}
      setSettings={setSettings}
      authClient={props.authClient}
      deviceContext={props.deviceContext}
    />
  );
};
