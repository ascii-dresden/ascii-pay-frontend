import React from "react";
import { useGetAllTransactionsQuery } from "../redux/api/accountApi";
import { AccountDto } from "../../common/contracts";
import styled from "@emotion/styled";
import { AccountChart } from "./AccountChart";
import { TerminalSettings } from "../pages/TerminalSettingsPage";

const StyledAccountOverview = styled.div`
  position: absolute;
  left: 1em;
  bottom: 1em;
  right: 1em;
`;

export const AccountOverview = (props: {
  account: AccountDto;
  height: number;
  fontSize: number;
  settings: TerminalSettings;
}) => {
  const {
    isLoading,
    isError,
    error,
    data: transactions,
  } = useGetAllTransactionsQuery(props.account.id);

  if (isLoading || !transactions) {
    return <></>;
  }

  return (
    <StyledAccountOverview>
      <AccountChart
        account={props.account}
        transactions={transactions}
        height={props.height}
        fontSize={props.fontSize}
        settings={props.settings}
      />
    </StyledAccountOverview>
  );
};
