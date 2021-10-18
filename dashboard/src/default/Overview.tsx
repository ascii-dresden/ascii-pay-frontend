import React from 'react';
import './Overview.scss';
import { Button, Card, Col, Layout, PageHeader, Row, Space, Statistic } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { GET_SELF, LOGOUT } from '../graphql';
import { AccountOutput } from '../model';
import { TransactionHistory } from './TransactionHistory/TransactionHistory';

const { Content, Footer } = Layout;
export default function Overview(props: { account: AccountOutput }) {
  const client = useApolloClient();

  const [logoutFunction, { data: logoutData }] = useMutation(LOGOUT);
  if (logoutData) {
    localStorage['token'] = '';
    client.refetchQueries({
      include: [GET_SELF],
    });
  }
  return (
    <div id="Overview">
      <Layout className="site-layout">
        <PageHeader
          title="Overview"
          extra={[
            <Link to="/admin/accounts">
              <Button key="admin" type="text">
                Open Management View
              </Button>
            </Link>,
            <Link to="/preferences">
              <Button key="preferences">Preferences</Button>
            </Link>,
            <Button
              key="logout"
              onClick={() => {
                logoutFunction().catch(() => {
                  // login failed
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
            <Row gutter={12} align="middle">
              <Col span={12}>
                <Card>
                  <Statistic title="Name" value={props.account.name} />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="Current balance"
                    value={(props.account.credit / 100).toFixed(2)}
                    prefix={<CreditCardOutlined />}
                    suffix="€"
                  />
                </Card>
              </Col>
            </Row>
            <TransactionHistory account={props.account} />
          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </div>
  );
}
