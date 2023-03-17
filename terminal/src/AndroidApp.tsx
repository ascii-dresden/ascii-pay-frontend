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
import { useLocation } from "react-router-dom";

export const AndroidApp = (props: {
  authClient: AsciiPayAuthenticationClient;
  deviceContext: TerminalDeviceContext;
}) => {
  let location = useLocation();

  const [width, setWidth] = React.useState("1000");
  const [height, setHeight] = React.useState("625");

  const [settings, setSettings] = React.useState<TerminalSettings>({
    language: localStorage["language"] ?? "en",
    theme: localStorage["theme"] ?? "light",
    highlightColor: localStorage["highlightColor"] ?? "green",
  });

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

  let terminalPage: TerminalAppPage = "start";
  let splitLocation = location.pathname.split("/");
  let lastLocation =
    splitLocation.length > 0 ? splitLocation[splitLocation.length - 1] : null;
  switch (lastLocation) {
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

  return (
    <TerminalApp
      page={terminalPage}
      width={parseInt(width)}
      height={parseInt(height)}
      settings={settings}
      setSettings={setSettings}
      authClient={props.authClient}
      deviceContext={props.deviceContext}
    />
  );
};
