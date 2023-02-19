import { useAppSelector } from "../redux/store";
import { FullScreenLoader } from "../components/FullScreenLoader";
import React from "react";
import { AccountDetailsPageView } from "../components/account/AccountDetailsPageView";

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.userState.user);

  if (!user) {
    return <FullScreenLoader />;
  }

  return <AccountDetailsPageView accountId={user.id} isRoot={true} />;
};
