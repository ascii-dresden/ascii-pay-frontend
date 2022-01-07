import React from 'react';
import './AccountPage.scss';
import { Layout, Card, Space, PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import AccountList from './AccountList';
import { getAccount_getAccount } from '../__generated__/getAccount';
const { Content, Footer } = Layout;

export default function AccountPage(props: { account: getAccount_getAccount }) {
  return (
    <div id="AccountList">
      <Layout className="site-layout">
        <PageHeader
          title="Accounts"
          extra={[
            <Link key="user" to="/">
              <Button type="text">Open User View</Button>
            </Link>,
            <Button key="logout">Logout</Button>,
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
