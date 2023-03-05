import { Outlet } from "react-router-dom";
import { useGetMeQuery } from "../redux/api/userApi";
import React from "react";
import { LoadingPage } from "../pages/LoadingPage";
import { useDashboardSelector } from "../redux/dashboardStore";
import { LoginPage } from "../pages/LoginPage";

export const RequireUserLogin = () => {
  const token = useDashboardSelector((state) => state.userState.token);
  const user = useDashboardSelector((state) => state.userState.user);

  const { isLoading, isFetching } = useGetMeQuery(token);

  if (isLoading || isFetching) {
    return <LoadingPage />;
  }

  return user ? <Outlet /> : <LoginPage />;
};
