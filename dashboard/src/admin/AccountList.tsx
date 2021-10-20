import React from 'react';
import './AccountList.scss';
import { Layout, Statistic, Card, Row, Col, Space, PageHeader, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getSelf_getSelf } from '../__generated__/getSelf';
const { Content, Footer } = Layout;

export default function AccountList(props: { account: getSelf_getSelf }) {
  return (
    <div id="AccountList">
      <Layout className="site-layout">
        <PageHeader
          title="Accounts"
          extra={[
            <Link to="/">
              <Button key="user" type="text">
                Open User View
              </Button>
            </Link>,
            <Button key="logout">Logout</Button>,
          ]}
        />
        <Content style={{ margin: '8px 16px 0', overflow: 'initial' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row gutter={12} align="middle">
              <Col span={12}>
                <Card>
                  <Statistic title="Name" value="Max Mustermann" />
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Statistic title="Name" value="Max Mustermann" />
                </Card>
              </Col>
            </Row>
          </Space>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </div>
  );
}
