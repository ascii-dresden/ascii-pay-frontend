import React from 'react';
import './Login.scss';
import { Form, Input, Button, Card, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useApolloClient, useMutation } from '@apollo/client';
import { GET_ACCOUNT, LOGIN } from '../graphql';

const LOGO_URL: string = process.env.PUBLIC_URL + '/ascii-pay-logo-wide.svg';

export default function Login() {
  const [mutateFunction, { data, loading, error }] = useMutation(LOGIN);
  const client = useApolloClient();

  const onFinish = (values: any) => {
    mutateFunction({
      variables: {
        username: values.username,
        password: values.password,
        accountAccessToken: null,
      },
    }).catch(() => {
      // login failed
    });
  };

  if (data) {
    localStorage['token'] = data.login.token;
    client.refetchQueries({
      include: [GET_ACCOUNT],
    });
  }

  let errorView = <></>;
  if (error) {
    errorView = <Alert type="error" message="Login failed!" />;
  }

  return (
    <div id="Login">
      <Card>
        <Spin spinning={!!loading}>
          <Form name="login" className="login-form" onFinish={onFinish}>
            <img src={LOGO_URL} alt="ascii pay" />
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
            {errorView}
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
