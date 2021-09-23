import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import AccountList from "./admin/AccountList";
import "./App.scss";
import Login from "./default/Login";
import Overview from "./default/Overview";
import Preferences from "./default/Preferences";
import { useQuery } from "@apollo/client";
import { GET_SELF } from "./graphql";
import { AccountOutput } from "./model";


export default function App() {
  const { loading, error, data } = useQuery(GET_SELF,{
    fetchPolicy: "network-only"
  });

  console.log(data, loading, error);

  if (loading) {
    return <></>;
  }

  if (error) {
    return <Login />;
  }

  const account = data.getSelf as AccountOutput

  return (
    <Router basename="">
      <Switch>
        <Route path="/admin/accounts">
          <AccountList account={account} />
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
