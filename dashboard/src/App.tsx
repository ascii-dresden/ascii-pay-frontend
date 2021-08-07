import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Login from "./components/Login";
import Overview from "./components/Overview";
import Preferences from "./components/Preferences";

const isLoggedIn = true;

export default function App() {
  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Router basename="">
      <Switch>
        <Route path="/preferences">
          <Preferences />
        </Route>
        <Route path="">
          <Overview />
        </Route>
      </Switch>
    </Router>
  );
}
