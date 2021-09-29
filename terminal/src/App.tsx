import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import PaymentPage from './payment/PaymentPage';
import RegisterPage from './register/RegisterPage';
import StartPage from './StartPage';

export default function App() {
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

  return (
    <Router basename="">
      <Switch>
        <Route path="/payment">
          <PaymentPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="">
          <StartPage />
        </Route>
      </Switch>
    </Router>
  );
}
