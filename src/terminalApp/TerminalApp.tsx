import styled from "@emotion/styled";
import React from "react";
import { TerminalStartPage } from "./pages/TerminalStartPage";
import { createTheme, ThemeProvider } from "@mui/material";
import clsx from "clsx";
import {
  TerminalSettings,
  TerminalSettingsPage,
} from "./pages/TerminalSettingsPage";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n_german from "./locales/de/translation.json";
import i18n_english from "./locales/en/translation.json";
import { createInstance } from "i18next";
import { ScreensaverClock } from "./components/ScreensaverClock";
import { TerminalRegisterPage } from "./pages/TerminalRegisterPage";
import { TerminalPaymentPage } from "./pages/TerminalPaymentPage";
import { TerminalAccountPage } from "./pages/TerminalAccountPage";
import { AppNotifications } from "./components/AppNotifications";
import { NotificationManager } from "./components/NotificationManager";
import { ConnectionIndicator } from "./components/ConnectionIndicator";
import {
  AsciiPayAuthenticationClient,
  TerminalDeviceContext,
} from "./client/AsciiPayAuthenticationClient";
import { Keyboard } from "./components/Keyboard";
import { createTerminalProxyHandler } from "./client/TerminalProxyHandler";
import { Provider } from "react-redux";
import { TerminalDispatch, terminalStore } from "./redux/terminalStore";
import { checkTimeouts, setScreensaver } from "./redux/features/terminalSlice";
import { checkPaymentTimeout } from "./redux/features/paymentSlice";

const StyledTerminalApp = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--secondary-background);
  color: var(--primary-text-color);
  user-select: none;
  overscroll-behavior: none;
  overflow: hidden;

  --border-color: #d0d0d0;
  --error-color: #e74c3c;
  --error-text-color: #ffffff;
  --primary-background: #fbfbfb;
  --primary-hover-background: #ffffff;
  --primary-text-color: #333333;
  --secondary-background: #eeeeee;
  --secondary-hover-background: #f5f5f5;
  --secondary-text-color: #979797;
  --success-color: #2ecc71;
  --success-text-color: #ffffff;
  --tertiary-background: #e0e0e0;
  --tertiary-hover-background: #e9e9e9;
  --warn-text-color: #ffffff;
  --warn-color: #f39c12;

  --theme-color: #2980b9;
  --theme-hover-color: #3498db;
  --theme-primary-text: #ffffff;
  --theme-secondary-text: #2980b9;

  --bottle-color: #fde09e;
  --coffee-color: #f1b474;
  --cup-color: #b5cbed;

  --active-tab-background: var(--secondary-background);

  &.coin-box-body {
    --active-tab-background: #003b6f;
  }

  &.note-box-body {
    --active-tab-background: #424242;
  }

  &.dark {
    --border-color: #555555;
    --error-color: #e74c3c;
    --error-text-color: #ffffff;
    --primary-background: #0d0d0d;
    --primary-hover-background: #000000;
    --primary-text-color: #ffffff;
    --secondary-background: #303030;
    --secondary-hover-background: #242424;
    --secondary-text-color: #868686;
    --success-color: #239a55;
    --success-text-color: #ffffff;
    --tertiary-background: #4d4d4d;
    --tertiary-hover-background: #404040;
    --warn-color: #e59311;
    --warn-text-color: #ffffff;
  }

  &.teal {
    --theme-color: #16a085;
    --theme-hover-color: #1abc9c;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #16a085;
  }

  &.green {
    --theme-color: #27ae60;
    --theme-hover-color: #2ecc71;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #27ae60;
  }

  &.blue {
    --theme-color: #2980b9;
    --theme-hover-color: #3498db;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #2980b9;
  }

  &.purple {
    --theme-color: #8e44ad;
    --theme-hover-color: #9b59b6;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #8e44ad;
  }

  &.yellow {
    --theme-color: #f39c12;
    --theme-hover-color: #f1c40f;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #f39c12;
  }

  &.orange {
    --theme-color: #d35400;
    --theme-hover-color: #e67e22;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #d35400;
  }

  &.red {
    --theme-color: #c0392b;
    --theme-hover-color: #e74c3c;
    --theme-primary-text: #ffffff;
    --theme-secondary-text: #c0392b;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--secondary-background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--secondary-text-color);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-text-color);
  }

  .form {
    padding: 1em;

    & > div {
      padding-bottom: 1em;
    }

    label {
      display: block;
      padding-bottom: 0.2em;
    }

    input,
    select,
    .input-box {
      width: 100%;
      height: 2.2em;
      border: solid 1px var(--border-color);
      border-radius: 0;
      color: var(--primary-text-color);
      padding: 0.4em 0.8em;
      font-size: 0.9em;
      background-color: var(--primary-background);

      &:hover {
        background-color: var(--primary-hover-background);
      }

      &:focus {
        background-color: var(--primary-hover-background);
        border-color: var(--theme-color);
        box-shadow: 0 0 0 1px var(--theme-color);
        outline: none;
      }

      &:read-only {
        background-color: var(--secondary-hover-background);

        &:hover {
          background-color: var(--primary-background);
        }
      }

      &:disabled {
        background-color: var(--tertiary-background);

        &:hover {
          background-color: var(--tertiary-hover-background);
        }
      }
    }

    .input-box {
      display: flex;
      align-items: center;
    }

    button {
      width: 100%;
      border: solid 1px var(--border-color);
      border-radius: 0;
      color: var(--primary-text-color);
      padding: 0.4em 0.8em;
      font-size: 0.9em;
      height: 2.2em;
      background-color: var(--tertiary-hover-background);

      svg {
        width: 0.6em !important;
        height: 0.6em !important;
      }

      &:hover {
        background-color: var(--secondary-background);
      }

      &:focus {
        background-color: var(--secondary-background);
        border-color: var(--theme-color);
        box-shadow: 0 0 0 1px var(--theme-color);
        outline: none;
      }

      &:disabled {
        background-color: var(--tertiary-background);

        &:hover {
          background-color: var(--tertiary-hover-background);
        }
      }
    }
  }

  .input-group {
    display: flex;

    & > :not(:last-child) {
      border-right: none;
    }
  }

  .input-row {
    display: flex;

    & > * {
      flex-grow: 1;
    }

    & > :not(:last-child) {
      margin-right: 0.4em;
    }
  }
`;

export type TerminalAppPage =
  | "start"
  | "payment"
  | "register"
  | "accounts"
  | "settings";
export type TerminalNavigateHandler = (page: TerminalAppPage) => void;

export const TerminalApp = React.memo(
  (props: {
    page: TerminalAppPage;
    width: number;
    height: number;
    settings: TerminalSettings;
    setSettings: (settings: TerminalSettings) => void;
    authClient: AsciiPayAuthenticationClient;
    deviceContext: TerminalDeviceContext;
    navigate: TerminalNavigateHandler;
  }) => {
    const [appClass, setAppClass] = React.useState<string | null>(null);
    const dispatch = terminalStore.dispatch as TerminalDispatch;

    React.useEffect(() => {
      const handler = createTerminalProxyHandler(dispatch, props.authClient);
      props.authClient.addEventHandler(handler);
      return () => props.authClient.removeEventHandler(handler);
      // eslint-disable-next-line
    }, [props.authClient]);

    const fontSize = React.useMemo(() => {
      const scale = Math.min(props.width / 800, props.height / 480);
      return Math.round(16 * scale);
    }, [props.width, props.height]);

    const theme = React.useMemo(
      () =>
        createTheme({
          palette: {
            mode: props.settings.theme,
          },
          typography: {
            button: {
              textTransform: "none",
            },
            fontSize: fontSize,
          },
        }),
      [props.settings, fontSize]
    );

    React.useEffect(() => {
      const timer = setInterval(() => {
        dispatch(checkTimeouts());
        dispatch(checkPaymentTimeout());
      });
      return () => {
        clearInterval(timer);
      };
    }, [dispatch]);

    let content;
    switch (props.page) {
      case "payment":
        content = (
          <TerminalPaymentPage
            authClient={props.authClient}
            deviceContext={props.deviceContext}
            navigate={props.navigate}
          />
        );
        break;
      case "register":
        content = (
          <TerminalRegisterPage
            setAppClass={setAppClass}
            navigate={props.navigate}
          />
        );
        break;
      case "accounts":
        content = (
          <TerminalAccountPage
            authClient={props.authClient}
            deviceContext={props.deviceContext}
            height={props.height}
            settings={props.settings}
            fontSize={fontSize}
            navigate={props.navigate}
          />
        );
        break;
      case "settings":
        content = (
          <TerminalSettingsPage
            width={props.width}
            height={props.height}
            settings={props.settings}
            setSettings={props.setSettings}
            navigate={props.navigate}
          />
        );
        break;
      default:
        content = (
          <TerminalStartPage
            authClient={props.authClient}
            deviceContext={props.deviceContext}
            navigate={props.navigate}
          />
        );
        break;
    }

    const resources = {
      de: {
        translation: i18n_german,
      },
      en: {
        translation: i18n_english,
      },
    };

    const i18nConfig = createInstance({
      resources,
      lng: props.settings.language,
      fallbackLng: "en",
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });

    i18nConfig.use(initReactI18next).init().catch(console.error);

    return (
      <Provider store={terminalStore}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18nConfig}>
            <StyledTerminalApp
              id="terminal-app"
              className={clsx(props.settings.highlightColor, appClass, {
                dark: props.settings.theme === "dark",
              })}
              style={{ fontSize: `${fontSize}px` }}
              onClick={() => dispatch(setScreensaver(false))}
            >
              <ConnectionIndicator authClient={props.authClient} />
              <Keyboard />
              <ScreensaverClock />
              {content}
              <AppNotifications
                authClient={props.authClient}
                deviceContext={props.deviceContext}
              />
              <NotificationManager />
              <div id="terminal-dialog-portal"></div>
            </StyledTerminalApp>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    );
  }
);
