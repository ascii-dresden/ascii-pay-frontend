import { useDashboardSelector } from "../redux/dashboardStore";
import { FullScreenLoader } from "../components/FullScreenLoader";
import React from "react";
import { AccountDetailsPageView } from "../components/account/AccountDetailsPageView";

export const ProfilePage = () => {
  const user = useDashboardSelector((state) => state.userState.user);

  if (!user) {
    return <FullScreenLoader />;
  }

  return <AccountDetailsPageView accountId={user.id} isRoot={true} />;
};
