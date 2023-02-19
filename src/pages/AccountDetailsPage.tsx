import React from "react";
import { useParams } from "react-router-dom";
import { AccountDetailsView } from "../components/account/AccountDetailsView";

export const AccountDetailsPage = () => {
  let params = useParams();

  let accountId = parseInt(params.accountId ?? "");
  return <AccountDetailsView accountId={accountId} />;
};
