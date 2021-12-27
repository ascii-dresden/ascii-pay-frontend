import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useApolloClient } from '@apollo/client';
import { createAccount, createAccountVariables } from '../__generated__/createAccount';
import { CREATE_ACCOUNT } from '../graphql';

const { Option } = Select;

export default function AccountCreateDialog(props: { closeDialog: () => void }) {
  const client = useApolloClient();
  const [createForm] = Form.useForm();

  const onCreateCancel = () => {
    props.closeDialog();
  };
  const onCreateSave = (form: any) => {
    (async () => {
      const variables: createAccountVariables = {
        name: form.name,
        permission: form.permission,
        username: form.username,
        mail: form.mail,
        accountNumber: form.accountNumber,
        minimumCredit: parseInt(form.minimumCredit),
      };
      await client.mutate<createAccount, createAccountVariables>({
        mutation: CREATE_ACCOUNT,
        variables,
      });
      props.closeDialog();
    })();
  };

  createForm.resetFields();
  return (
    <Modal
      title="Create account"
      visible={true}
      okText="Create"
      cancelText="Cancel"
      onCancel={onCreateCancel}
      onOk={() => {
        createForm
          .validateFields()
          .then((values) => {
            createForm.resetFields();
            onCreateSave(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="account-create-form"
        onFinish={onCreateSave}
      >
        <Form.Item label="Name" name="name">
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item label="Permission" name="permission">
          <Select placeholder="Permission">
            <Option value="DEFAULT">DEFAULT</Option>
            <Option value="MEMBER">MEMBER</Option>
            <Option value="ADMIN">ADMIN</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Username" name="username">
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item label="Mail" name="mail">
          <Input placeholder="Mail" />
        </Form.Item>
        <Form.Item label="Account number" name="accountNumber">
          <Input placeholder="Account number" />
        </Form.Item>
        <Form.Item label="Minimum credit" name="minimumCredit">
          <Input suffix="cents" placeholder="Minimum credit" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
