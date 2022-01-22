import React from 'react';
import './Overview.scss';
import { Button, Card, Col, Layout, PageHeader, Row, Space, Statistic } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { GET_ACCOUNT, LOGOUT } from '../graphql';
import { TransactionHistory } from './TransactionHistory/TransactionHistory';
import { logout } from '../__generated__/logout';
import { getAccount_getAccount } from '../__generated__/getAccount';

const APPLE_WALLET_URL: string = '/apple-wallet.svg';
const COFFEE_STAMP_URL: string = '/kaffe_stempel_icons.svg';
const BOTTLE_STAMP_URL: string = '/getraeke_stempel_icons.svg';

const { Content, Footer } = Layout;
export default function Overview(props: { account: getAccount_getAccount }) {
  const client = useApolloClient();

  const [logoutFunction, { data: logoutData }] = useMutation<logout>(LOGOUT);
  if (logoutData) {
    localStorage['token'] = '';
    client.refetchQueries({
      include: [GET_ACCOUNT],
    });
  }
  return (
    <div id="Overview">
      <Layout className="site-layout">
        <PageHeader
          title="Overview"
          extra={[
            <Link key="admin" to="/admin/accounts">
              <Button type="text">Open Management View</Button>
            </Link>,
            <Link key="preferences" to="/preferences">
              <Button>Preferences</Button>
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
            <Row gutter={12} align="middle">
              <Col span={12}>
                <Card>
                  <Statistic title="Name" value={props.account.name} />

                  <a
                    className="apple-wallet"
                    href={'/v1/AsciiPayCard.pkpass?auth_token=' + localStorage.getItem('token')}
                  >
                    <img src={APPLE_WALLET_URL} alt="Download apple wallet card" />
                  </a>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Space>
                    <Statistic
                      title="Current balance"
                      value={(props.account.credit / 100).toFixed(2)}
                      prefix={<CreditCardOutlined />}
                      suffix="€"
                    />
                    <Statistic
                      title="Coffee stamps"
                      value={props.account.coffeeStamps}
                      prefix={
                        <img
                          style={{ width: '1.4rem', marginTop: '-0.4rem' }}
                          src={COFFEE_STAMP_URL}
                          alt="Coffee stamp icon"
                        />
                      }
                    />
                    <Statistic
                      title="Bottle stamps"
                      value={props.account.bottleStamps}
                      prefix={
                        <img
                          style={{ width: '1.4rem', marginTop: '-0.4rem' }}
                          src={BOTTLE_STAMP_URL}
                          alt="Bottle stamp icon"
                        />
                      }
                    />
                  </Space>
                </Card>
              </Col>
            </Row>
            <TransactionHistory />
          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </div>
  );
}
