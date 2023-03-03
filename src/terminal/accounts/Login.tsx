import React from "react";
import { useTranslation } from "react-i18next";
import { AsciiPayAuthenticationClient } from "../client/AsciiPayAuthenticationClient";
import styled from "@emotion/styled";
import { ContactlessPayment } from "../../components/ContactlessPayment";

const StyledLogin = styled.div`
  & > span {
    display: block;
    padding: 0 1em;
    font-weight: bold;
    text-align: center;
    margin-top: 5em;
    margin-bottom: 2em;
  }
`;

const StyledLoginSplit = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 0.4em;
  height: 14em;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 1px;
    background-color: var(--border-color);
  }

  &::after {
    content: attr(data-or);
    text-align: center;
    background-color: var(--secondary-background);
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2em;
    line-height: 1.6em;
    margin-left: -1em;
    margin-top: -0.8em;
  }

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 3em;

    & > div {
      width: 100%;
    }

    svg {
      width: 12em;
      height: 12em;
    }
  }
`;

export const Login = (props: { authClient: AsciiPayAuthenticationClient }) => {
  const { t } = useTranslation();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const usernameInput = React.useRef<HTMLInputElement>(null);
  const passwordInput = React.useRef<HTMLInputElement>(null);

  return (
    <StyledLogin>
      <span>{t("account.loginMessage")}</span>
      <StyledLoginSplit data-or={t("general.or")}>
        <div className="form">
          <div>
            <label>{t("account.username")}</label>
            <input
              ref={usernameInput}
              placeholder={t("account.username")}
              inputMode="none"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>{t("account.password")}</label>
            <input
              ref={passwordInput}
              placeholder={t("account.password")}
              inputMode="none"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button>{t("account.login")}</button>
        </div>
        <div>
          <ContactlessPayment />
        </div>
      </StyledLoginSplit>
    </StyledLogin>
  );
};