import React from "react";
import { useParams } from "react-router-dom";
import { AccountDetailsPageView } from "../components/account/AccountDetailsPageView";

export const AccountDetailsPage = () => {
  let params = useParams();

  let accountId = parseInt(params.accountId ?? "");
  return <AccountDetailsPageView accountId={accountId} />;
};
