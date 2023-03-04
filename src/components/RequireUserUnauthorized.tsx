import { Navigate, Outlet } from "react-router-dom";
import { RoleDto } from "../redux/api/contracts";
import React from "react";
import { useAppSelector } from "../redux/store";

export const RequireUserUnauthorized = ({
  allowedRoles,
}: {
  allowedRoles: RoleDto[];
}) => {
  const user = useAppSelector((state) => state.userState.user);

  return user && allowedRoles.includes(user?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
