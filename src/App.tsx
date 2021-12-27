import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import Login from './default/Login';
import Overview from './default/Overview';
import Preferences from './default/Preferences';
import { useQuery } from '@apollo/client';
import { GET_SELF } from './graphql';
import { getSelf } from './__generated__/getSelf';
import AccountPage from './admin/AccountPage';

export default function App() {
  const { loading, error, data } = useQuery<getSelf>(GET_SELF, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <></>;
  }

  if (error || !data) {
    return <Login />;
  }

  const account = data.getSelf;

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
