import React from 'react';
import './Overview.scss';
import { Layout, Card, PageHeader, Button, Form, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { AccountOutput } from '../model';
const { Content, Footer } = Layout;

export default function Preferences(props: { account: AccountOutput }) {
  let history = useHistory();

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div id="Preferences">
      <Layout className="site-layout">
        <PageHeader
          title="Preferences"
          onBack={() => history.goBack()}
          extra={[<Button key="logout">Logout</Button>]}
        />
        <Content style={{ margin: '8px 16px 0', overflow: 'initial' }}>
          <Card>
            <Form
              name="preferences"
              className="preferences-form"
              layout="vertical"
              initialValues={{
                username: props.account.username,
                name: props.account.name,
                accountNumber: props.account.accountNumber,
              }}
              onFinish={onFinish}
            >
              <Form.Item name="username" label="Username">
                <Input placeholder="Username" readOnly={true} />
              </Form.Item>
              <Form.Item name="name" label="Name">
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item name="accountNumber" label="Account number">
                <Input placeholder="Account number" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="preferences-form-button">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </div>
  );
}
