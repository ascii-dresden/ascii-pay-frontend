import { Navigate, Outlet } from "react-router-dom";
import { RoleDto } from "../../common/contracts";
import React from "react";
import { useDashboardSelector } from "../redux/dashboardStore";

export const RequireUserUnauthorized = ({
  allowedRoles,
}: {
  allowedRoles: RoleDto[];
}) => {
  const user = useDashboardSelector((state) => state.userState.user);

  return user && allowedRoles.includes(user?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
