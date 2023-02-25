import React from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { SidebarLayout } from "../components/SidebarLayout";
import logo from "../../assets/ascii-circle-icon.svg";

const StyledSettings = styled.div`
  & > span {
    display: block;
    padding: 1.2rem 1rem 0.8rem;
    font-weight: bold;
  }
`;

const StyledSettingsColumns = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.4rem;

  & > div {
    position: relative;

    & > div {
      position: relative;
      padding: 0 1rem;

      div {
        max-width: 100%;
      }

      & > span {
        display: block;
        padding: 0.5rem 0 0.2rem;
      }

      .form {
        padding: 0;

        button {
          margin-bottom: 0.4rem;
        }
      }
    }
  }
`;

const StyledSettingsTheme = styled.div`
  display: flex;

  div {
    width: 10rem;
    height: 6rem;
    border: solid 0.2rem var(--secondary-background);
    margin: 0.2rem;
    position: relative;

    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 2rem;
      height: 100%;
    }

    &::after {
      content: attr(data-name);
      display: block;
      position: absolute;
      left: 2.4rem;
      bottom: 0.4rem;
      font-size: 0.8rem;
    }

    img {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: 1rem;
      height: 1rem;
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
    width: 2rem;
    height: 2rem;
    border: solid 0.2rem var(--border-color);
    border-radius: 100%;
    margin: 0.2rem;
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
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoBack = () => navigate("/terminal");

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
                    document.getElementById("root")?.requestFullscreen()
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
                <code>-</code>
              </StyledSettingsProxyStatus>
            </div>
          </div>
        </StyledSettingsColumns>
      </StyledSettings>
    </SidebarLayout>
  );
};
