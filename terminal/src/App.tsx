import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AccountsPage from './accounts/AccountsPage';
import './App.scss';
import { AsciiPayAuthenticationClient } from './ascii-pay-authentication-client';
import PaymentPage from './payment/PaymentPage';
import { checkTimeouts } from './payment/paymentSlice';
import RegisterPage from './register/RegisterPage';
import SettingsPage from './SettingsPage';
import StartPage from './StartPage';
import { useAppDispatch } from './store';

export default function App(props: { authClient: AsciiPayAuthenticationClient }) {
  const dispatch = useAppDispatch();

  const onresize = () => {
    const scale = Math.min(window.innerWidth / 800, window.innerHeight / 480);
    document.documentElement.style.fontSize = Math.round(16 * scale) + 'px';
  };

  useEffect(() => {
    window.addEventListener('resize', onresize);
    return () => {
      window.removeEventListener('resize', onresize);
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => dispatch(checkTimeouts()));
    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  return (
    <Router basename="">
      <Switch>
        <Route path="/payment">
          <PaymentPage authClient={props.authClient} />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/accounts">
          <AccountsPage authClient={props.authClient} />
        </Route>
        <Route path="/settings">
          <SettingsPage authClient={props.authClient} />
        </Route>
        <Route path="">
          <StartPage />
        </Route>
      </Switch>
    </Router>
  );
}
