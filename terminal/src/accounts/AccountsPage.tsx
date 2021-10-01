import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { MdExitToApp } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/SidebarPage';
import { GET_SELF, LOGOUT } from '../graphql';
import { AccountOutput } from '../model';
import AccountDetails from './AccountDetails';
import AccountList from './AccountList';
import './AccountsPage.scss';
import Login from './Login';

export default function AccountsPage() {
  const client = useApolloClient();
  const history = useHistory();

  const handleGoBack = () => {
    logoutFunction().catch(() => {
      // login failed
    });
    history.goBack();
  };

  const { loading, error, data } = useQuery(GET_SELF, {
    fetchPolicy: 'network-only',
  });

  const [logoutFunction, { data: logoutData }] = useMutation(LOGOUT);
  let [accountId, setAccountId] = useState(null as string | null);

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

  if (logoutData) {
    localStorage['token'] = '';
    client.resetStore();
    client.refetchQueries({
      include: [GET_SELF],
    });
  }

  const account = data.getSelf as AccountOutput;
  const logout = () => {
    logoutFunction().catch(() => {
      // login failed
    });
  };

  return (
    <Sidebar defaultAction={handleGoBack}>
      <div className="logged-account-header">
        <span>{account.name}</span>
        <span>{account.permission}</span>
        <div onClick={logout}>
          <MdExitToApp />
        </div>
      </div>
      <AccountList onSelect={(id) => setAccountId(id)} />
      {accountId ? <AccountDetails id={accountId} /> : <></>}
    </Sidebar>
  );
}
