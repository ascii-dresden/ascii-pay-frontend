import React from "react";
import "./Login.scss";
import { Form, Input, Button, Checkbox, Image, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LOGO_URL: string = process.env.PUBLIC_URL + "/ascii-pay-logo-wide.svg";

export default function Login() {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  return (
    <div id="Login">
      <Card>
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Image src={LOGO_URL} />
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
      </Card>
    </div>
  );
}
