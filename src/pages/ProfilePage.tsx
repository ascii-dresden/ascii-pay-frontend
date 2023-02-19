import { useAppSelector } from "../redux/store";
import { FullScreenLoader } from "../components/FullScreenLoader";
import React from "react";
import { AccountDetailsView } from "../components/account/AccountDetailsView";

export const ProfilePage = () => {
  const user = useAppSelector((state) => state.userState.user);

  if (!user) {
    return <FullScreenLoader />;
  }

  return <AccountDetailsView accountId={user.id} isRoot={true} />;
};
