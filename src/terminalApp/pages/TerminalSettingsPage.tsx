import React from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import clsx from "clsx";
import { SidebarLayout } from "../components/SidebarLayout";
import logo from "../../assets/ascii-circle-icon.svg";
import { TerminalNavigateHandler } from "../TerminalApp";
import { AsciiPayAuthenticationClient } from "../client/AsciiPayAuthenticationClient";

const StyledSettings = styled.div`
  & > span {
    display: block;
    padding: 1.2em 1em 0.8em;
    font-weight: bold;
  }
`;

const StyledSettingsColumns = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.4em;

  & > div {
    position: relative;

    & > div {
      position: relative;
      padding: 0 1em;

      div {
        max-width: 100%;
      }

      & > span {
        display: block;
        padding: 0.5em 0 0.2em;
      }

      .form {
        padding: 0;

        button {
          margin-bottom: 0.4em;
        }
      }
    }
  }
`;

const StyledSettingsTheme = styled.div`
  display: flex;

  div {
    width: 10em;
    height: 6em;
    border: solid 0.2em var(--secondary-background);
    margin: 0.2em;
    position: relative;

    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 2em;
      height: 100%;
    }

    &::after {
      content: attr(data-name);
      display: block;
      position: absolute;
      left: 2.4em;
      bottom: 0.4em;
      font-size: 0.8em;
    }

    img {
      position: absolute;
      top: 0.5em;
      left: 0.5em;
      width: 1em;
      height: 1em;
    }
  }

  .active {
    border-color: var(--theme-hover-color);
  }

  .theme-light {
    background-color: #eeeeee;
    color: #333333;
    margin-left: 0;

    &::before {
      background-color: #fbfbfb;
    }
  }

  .theme-dark {
    background-color: #303030;
    color: #ffffff;

    &::before {
      background-color: #0d0d0d;
    }

    img {
      filter: invert(1);
    }
  }
`;

const StyledSettingsHighlightColor = styled.div`
  display: flex;

  div {
    width: 2em;
    height: 2em;
    border: solid 0.2em var(--border-color);
    border-radius: 100%;
    margin: 0.2em;
  }

  .active {
    border-color: var(--primary-text-color);
  }

  .color-teal {
    background-color: #16a085;
    margin-left: 0;
  }

  .color-green {
    background-color: #27ae60;
  }

  .color-blue {
    background-color: #2980b9;
  }

  .color-purple {
    background-color: #8e44ad;
  }

  .color-yellow {
    background-color: #f39c12;
  }

  .color-orange {
    background-color: #d35400;
  }

  .color-red {
    background-color: #c0392b;
  }
`;

const StyledSettingsProxyStatus = styled.div`
  white-space: pre;
  overflow: auto;
  max-width: 100%;
`;

const highlightColors = [
  "teal",
  "green",
  "blue",
  "purple",
  "yellow",
  "orange",
  "red",
] as const;
export type TerminalSettings = {
  theme: "light" | "dark";
  highlightColor:
    | "teal"
    | "green"
    | "blue"
    | "purple"
    | "yellow"
    | "orange"
    | "red";
  language: "en" | "de";
};

export const TerminalSettingsPage = (props: {
  width: number;
  height: number;
  settings: TerminalSettings;
  setSettings: (settings: TerminalSettings) => void;
  navigate: TerminalNavigateHandler;
  authClient: AsciiPayAuthenticationClient;
}) => {
  const { t } = useTranslation();
  const handleGoBack = () => props.navigate("start");

  const highlightColorViews = highlightColors.map((c) => (
    <div
      key={c}
      className={clsx("color-" + c, {
        active: c === props.settings.highlightColor,
      })}
      onClick={() =>
        props.setSettings({
          ...props.settings,
          highlightColor: c,
        })
      }
    ></div>
  ));

  return (
    <SidebarLayout defaultAction={handleGoBack}>
      <StyledSettings>
        <span>{t("settingsPage.name")}</span>
        <StyledSettingsColumns>
          <div>
            <div>
              <span>{t("settingsPage.language")}</span>
              <div className="settings-item settings-actions form">
                <select
                  value={props.settings.language}
                  onChange={(e) =>
                    props.setSettings({
                      ...props.settings,
                      language: e.target.value as "de" | "en",
                    })
                  }
                >
                  <option value="de">{t("settingsPage.languageGerman")}</option>
                  <option value="en">
                    {t("settingsPage.languageEnglish")}
                  </option>
                </select>
              </div>
            </div>
            <div>
              <span>{t("settingsPage.theme")}</span>
              <StyledSettingsTheme className="settings-item">
                <div
                  data-name={t("settingsPage.themeLight")}
                  className={clsx("theme-light", {
                    active: props.settings.theme === "light",
                  })}
                  onClick={() =>
                    props.setSettings({
                      ...props.settings,
                      theme: "light",
                    })
                  }
                >
                  <img src={logo} alt="" />
                </div>
                <div
                  data-name={t("settingsPage.themeDark")}
                  className={clsx("theme-dark", {
                    active: props.settings.theme === "dark",
                  })}
                  onClick={() =>
                    props.setSettings({
                      ...props.settings,
                      theme: "dark",
                    })
                  }
                >
                  <img src={logo} alt="" />
                </div>
              </StyledSettingsTheme>
            </div>
            <div>
              <span>{t("settingsPage.highlightColor")}</span>
              <StyledSettingsHighlightColor className="settings-item">
                {highlightColorViews}
              </StyledSettingsHighlightColor>
            </div>
            <div>
              <span>{t("settingsPage.actions")}</span>
              <div className="settings-item settings-actions form">
                <button onClick={() => window.location.reload()}>
                  {t("settingsPage.reload")}
                </button>
                <button
                  onClick={() =>
                    document.getElementById("terminal-app")?.requestFullscreen()
                  }
                >
                  {t("settingsPage.fullscreen")}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <span>{t("settingsPage.windowSize")}</span>
              <div>
                {props.width}x{props.height}
              </div>
              <span>{t("settingsPage.terminal")}</span>
              <StyledSettingsProxyStatus className="settings-item">
                <code>{props.authClient.toString()}</code>
              </StyledSettingsProxyStatus>
            </div>
          </div>
        </StyledSettingsColumns>
      </StyledSettings>
    </SidebarLayout>
  );
};
