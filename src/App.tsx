import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import Login from './default/Login';
import Overview from './default/Overview';
import Preferences from './default/Preferences';
import { useQuery } from '@apollo/client';
import { GET_ACCOUNT } from './graphql';
import AccountPage from './admin/AccountPage';
import { getAccount } from './__generated__/getAccount';

export default function App() {
  const { loading, error, data } = useQuery<getAccount>(GET_ACCOUNT, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <></>;
  }

  if (error || !data) {
    return <Login />;
  }

  const account = data.getAccount;

  return (
    <Router basename="">
      <Switch>
        <Route path="/admin/accounts">
          <AccountPage account={account} />
        </Route>
        <Route path="/admin">
          <Redirect to="/admin/accounts" />
        </Route>
        <Route path="/preferences">
          <Preferences account={account} />
        </Route>
        <Route path="">
          <Overview account={account} />
        </Route>
      </Switch>
    </Router>
  );
}
