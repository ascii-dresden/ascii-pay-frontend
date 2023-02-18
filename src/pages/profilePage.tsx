import { useAppSelector } from "../redux/store";
import FullScreenLoader from "../components/FullScreenLoader";
import React from "react";
import { AccountDetailsPage } from "./accountDetailsPage";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.userState.user);

  if (!user) {
    return <FullScreenLoader />;
  }

  return <AccountDetailsPage accountId={user.id} />;
};

export default ProfilePage;
