import React from "react";
import { useCookies } from "react-cookie";
import FullScreenLoader from "../components/FullScreenLoader";
import { userApi } from "../redux/api/userApi";

export const AuthMiddleware = (props: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [ascii_pay_session] = useCookies(["ascii_pay_session"]);

  const { isLoading } = userApi.endpoints.getMe.useQuery(null, {
    skip: !ascii_pay_session.ascii_pay_session,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <>{props.children}</>;
};
