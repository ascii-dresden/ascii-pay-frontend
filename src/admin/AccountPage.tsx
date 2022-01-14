import React from 'react';
import './AccountPage.scss';
import { Layout, Card, Space, PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import AccountList from './AccountList';
import { getAccount_getAccount } from '../__generated__/getAccount';
import { useApolloClient, useMutation } from '@apollo/client';
import { logout } from '../__generated__/logout';
import { GET_ACCOUNT, LOGOUT } from '../graphql';
const { Content, Footer } = Layout;

export default function AccountPage(props: { account: getAccount_getAccount }) {
  const client = useApolloClient();

  const [logoutFunction, { data: logoutData }] = useMutation<logout>(LOGOUT);
  if (logoutData) {
    localStorage['token'] = '';
    client.refetchQueries({
      include: [GET_ACCOUNT],
    });
  }

  return (
    <div id="AccountList">
      <Layout className="site-layout">
        <PageHeader
          title="Accounts"
          extra={[
            <Link key="user" to="/">
              <Button type="text">Open User View</Button>
            </Link>,
            <Button
              key="logout"
              onClick={() => {
                logoutFunction().catch(() => {
                  // logout failed
                });
                localStorage.removeItem('token');
              }}
            >
              Logout
            </Button>,
          ]}
        />
        <Content style={{ margin: '8px 16px 0', overflow: 'initial' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card>
              <AccountList />
            </Card>
          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </div>
  );
}
