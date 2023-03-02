import React from "react";
import { useTranslation } from "react-i18next";
import { AsciiPayAuthenticationClient } from "../client/AsciiPayAuthenticationClient";
import { useGetAccountQuery } from "../../redux/api/accountApi";
import styled from "@emotion/styled";

const StyledAccountDetails = styled.div`
  position: absolute;
  top: 4.4em;
  left: 16em;
  right: 0;
  bottom: 0;
  padding: 0.5em 1em 0.5em 0.5em;
  overflow-y: auto;
`;

export const AccountDetails = (props: {
  accountId: number;
  authClient: AsciiPayAuthenticationClient;
}) => {
  const { t } = useTranslation();

  const { isLoading, data: account } = useGetAccountQuery(props.accountId);

  if (isLoading || !account) {
    return <StyledAccountDetails className="form"></StyledAccountDetails>;
  }

  return (
    <StyledAccountDetails className="form">
      <div>
        <label>{t("account.name")}</label>
        <input readOnly={true} value={account.name || ""} />
      </div>
    </StyledAccountDetails>
  );
};
