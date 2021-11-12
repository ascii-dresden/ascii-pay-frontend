import React from 'react';
import './AccountPage.scss';
import { Layout, Card, Space, PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getSelf_getSelf } from '../__generated__/getSelf';
import AccountList from './AccountList';
const { Content, Footer } = Layout;

export default function AccountPage(props: { account: getSelf_getSelf }) {
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
