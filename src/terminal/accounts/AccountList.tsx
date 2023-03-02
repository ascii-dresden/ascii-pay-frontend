import React from "react";
import { useGetAllAccountsQuery } from "../../redux/api/accountApi";
import styled from "@emotion/styled";

const StyledAccountList = styled.div`
  position: absolute;
  top: 4.4em;
  left: 0;
  width: 16em;
  bottom: 0;
  padding: 0.5em 0;
  overflow-y: scroll;

  div.active {
    background-color: var(--secondary-hover-background);
  }

  span {
    display: block;
    padding: 0.5em 1em;
  }
`;

export const AccountList = (props: {
  id: number | null;
  onSelect: (id: number) => void;
}) => {
  const {
    isLoading,
    isError,
    error,
    data: accounts,
  } = useGetAllAccountsQuery();

  if (isLoading || !accounts) {
    return <></>;
  }

  let sortedData = [...accounts];
  sortedData.sort((a, b) => a.name.localeCompare(b.name));

  const accountList = sortedData.map((account) => (
    <div key={account.id} className={account.id === props.id ? "active" : ""}>
      <span onClick={() => props.onSelect(account.id)}>{account.name}</span>
    </div>
  ));

  return <StyledAccountList>{accountList}</StyledAccountList>;
};
