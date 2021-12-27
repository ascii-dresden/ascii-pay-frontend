import React from 'react';
import { Modal, Form, Input, Divider, Select } from 'antd';
import { EditAccount } from './AccountList';
import { updateAccount, updateAccountVariables } from '../__generated__/updateAccount';
import { useApolloClient } from '@apollo/client';
import { UPDATE_ACCOUNT } from '../graphql';

const { Option } = Select;

export default function AccountEditDialog(props: { account: EditAccount; closeDialog: () => void }) {
  const client = useApolloClient();
  const [updateForm] = Form.useForm();

  const onUpdateCancel = () => {
    props.closeDialog();
  };
  const onUpdateSave = (form: any) => {
    (async () => {
      const variables: updateAccountVariables = {
        id: form.id,
        name: form.name,
        permission: form.permission,
        username: form.username,
        mail: form.mail,
        accountNumber: form.accountNumber,
        minimumCredit: parseInt(form.minimumCredit),
      };
      await client.mutate<updateAccount, updateAccountVariables>({
        mutation: UPDATE_ACCOUNT,
        variables,
      });
      props.closeDialog();
    })();
  };

  updateForm.setFieldsValue({
    id: props.account.id,
    name: props.account.name,
    permission: props.account.permission,
    username: props.account.username,
    mail: props.account.mail,
    accountNumber: props.account.accountNumber,
    minimumCredit: props.account.minimumCredit,
  });
  return (
    <Modal
      title="Edit account"
      visible={true}
      okText="Update"
      cancelText="Cancel"
      onCancel={onUpdateCancel}
      onOk={() => {
        updateForm
          .validateFields()
          .then((values) => {
            updateForm.resetFields();
            onUpdateSave(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={updateForm}
        name="update-create"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        className="account-edit-form"
        onFinish={onUpdateSave}
      >
        <Form.Item label="Id" name="id">
          <Input placeholder="Id" readOnly={true} />
        </Form.Item>
        <Divider />
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
