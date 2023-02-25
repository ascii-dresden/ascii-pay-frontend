import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
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
    padding: 1rem;

    & > div {
      padding-bottom: 1rem;
    }

    label {
      display: block;
      padding-bottom: 0.2rem;
    }

    input,
    select {
      width: 100%;
      border: solid 1px var(--border-color);
      border-radius: 0;
      color: var(--primary-text-color);
      padding: 0.4rem 0.8rem;
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

    button {
      width: 100%;
      border: solid 1px var(--border-color);
      border-radius: 0;
      color: var(--primary-text-color);
      padding: 0.4rem 0.8rem;
      font-size: 0.9em;
      background-color: var(--tertiary-hover-background);

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
      margin-right: 0.4rem;
    }
  }
`;

export type TerminalAppPage =
  | "start"
  | "payment"
  | "register"
  | "accounts"
  | "settings";

export const TerminalApp = (props: {
  page: TerminalAppPage;
  width: number;
  height: number;
  settings: TerminalSettings;
  setSettings: (settings: TerminalSettings) => void;
}) => {
  const params = useParams();

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
        },
      }),
    [props.settings]
  );

  let content;
  switch (params.page) {
    case "payment":
      content = <span>payment</span>;
      break;
    case "register":
      content = <span>register</span>;
      break;
    case "accounts":
      content = <span>accounts</span>;
      break;
    case "settings":
      content = (
        <TerminalSettingsPage
          width={props.width}
          height={props.height}
          settings={props.settings}
          setSettings={props.setSettings}
        />
      );
      break;
    default:
      content = <TerminalStartPage />;
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

  i18nConfig.use(initReactI18next).init();

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18nConfig}>
        <StyledTerminalApp
          className={clsx(props.settings.highlightColor, {
            dark: props.settings.theme === "dark",
          })}
        >
          {content}
        </StyledTerminalApp>
      </I18nextProvider>
    </ThemeProvider>
  );
};
