import { useDashboardSelector } from "../redux/dashboardStore";
import { FullScreenLoader } from "../components/FullScreenLoader";
import React from "react";
import { AccountDetailsPageView } from "../components/account/AccountDetailsPageView";
import { useMediaQuery, useTheme } from "@mui/material";
import { MobileAccountPageView } from "../components/account/MobileAccountPageView";

export const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useDashboardSelector((state) => state.userState.user);

  if (!user) {
    return <FullScreenLoader />;
  }

  if (isMobile) {
    return <MobileAccountPageView accountId={user.id} />;
  }

  return <AccountDetailsPageView accountId={user.id} isRoot={true} />;
};
