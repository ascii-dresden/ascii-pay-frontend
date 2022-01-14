import React from 'react';
import './Overview.scss';
import { Layout, Card, PageHeader, Button, Form, Input, Divider } from 'antd';
import { useHistory } from 'react-router-dom';
import { getAccount_getAccount } from '../__generated__/getAccount';
import { useApolloClient, useMutation } from '@apollo/client';
import { setAccountPassword, setAccountPasswordVariables } from '../__generated__/setAccountPassword';
import { GET_ACCOUNT, LOGOUT, SET_ACCOUNT_PASSWORD } from '../graphql';
import { logout } from '../__generated__/logout';
const { Content, Footer } = Layout;

export default function Preferences(props: { account: getAccount_getAccount }) {
  const client = useApolloClient();
  let history = useHistory();

  const [logoutFunction, { data: logoutData }] = useMutation<logout>(LOGOUT);
  if (logoutData) {
    localStorage['token'] = '';
    client.refetchQueries({
      include: [GET_ACCOUNT],
    });
  }

  const onFinish = (values: any) => {
    (async () => {
      try {
        await client.mutate<setAccountPassword, setAccountPasswordVariables>({
          mutation: SET_ACCOUNT_PASSWORD,
          variables: {
            id: props.account.id,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
        });
      } catch (e) {
        console.error(e);
      }
    })();
  };
  return (
    <div id="Preferences">
      <Layout className="site-layout">
        <PageHeader
          title="Preferences"
          onBack={() => history.goBack()}
          extra={[
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
          <Card>
            <Form
              name="preferences"
              className="preferences-form"
              layout="vertical"
              initialValues={{
                username: props.account.username,
                name: props.account.name,
                accountNumber: props.account.accountNumber,
                oldPassword: '',
                newPassword: '',
              }}
              onFinish={onFinish}
            >
              <Form.Item name="username" label="Username">
                <Input placeholder="Username" readOnly={true} />
              </Form.Item>
              <Form.Item name="name" label="Name">
                <Input placeholder="Name" readOnly={true} />
              </Form.Item>
              <Form.Item name="accountNumber" label="Account number">
                <Input placeholder="Account number" readOnly={true} />
              </Form.Item>
              <Divider />
              <Form.Item name="oldPassword" label="Old password">
                <Input type="password" placeholder="Old password" />
              </Form.Item>
              <Form.Item name="newPassword" label="New password">
                <Input type="password" placeholder="New password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="preferences-form-button">
                  Change password
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
