import React from 'react';
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/SidebarPage';
import './AccountsPage.scss';
import Login from './Login';

export default function AccountsPage() {
  const history = useHistory();
  const handleGoBack = () => history.goBack();

  const loggedAccount = null;

  if (!loggedAccount) {
    return (
      <Sidebar defaultAction={handleGoBack}>
        <Login />
      </Sidebar>
    );
  }

  return (
    <Sidebar defaultAction={handleGoBack}>
      <div>Accounts!</div>
    </Sidebar>
  );
}
