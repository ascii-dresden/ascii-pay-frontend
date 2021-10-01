import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/SidebarPage';
import { GET_SELF, LOGOUT } from '../graphql';
import { AccountOutput } from '../model';
import './AccountsPage.scss';
import Login from './Login';

export default function AccountsPage() {
  const client = useApolloClient();
  const history = useHistory();

  const [logoutFunction, { data: logoutData }] = useMutation(LOGOUT);
  if (logoutData) {
    client.resetStore();
    client.refetchQueries({
      include: [GET_SELF],
    });
  }

  const handleGoBack = () => {
    logoutFunction().catch(() => {
      // login failed
    });
    history.goBack();
  };

  const { loading, error, data } = useQuery(GET_SELF, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <Sidebar defaultAction={handleGoBack}></Sidebar>;
  }

  if (error) {
    return (
      <Sidebar defaultAction={handleGoBack}>
        <Login />
      </Sidebar>
    );
  }

  const account = data.getSelf as AccountOutput;

  return (
    <Sidebar defaultAction={handleGoBack}>
      <div>Accounts {account.name}</div>
    </Sidebar>
  );
}
