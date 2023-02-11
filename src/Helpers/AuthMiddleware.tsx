import React from 'react';
import { useCookies } from 'react-cookie';
import FullScreenLoader from '../components/FullScreenLoader';
import { userApi } from '../redux/api/userApi';

export const AuthMiddleware = (props: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [cookies] = useCookies(["logged_in"]);

  const { isLoading } = userApi.endpoints.getMe.useQuery(null, {
    skip: !cookies.logged_in,
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <>{props.children}</>;
};
