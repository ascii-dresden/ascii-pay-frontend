import React, { useState } from 'react';
import './AccountList.scss';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { useApolloClient, useQuery } from '@apollo/client';
import { getAccounts, getAccounts_getAccounts_element } from '../__generated__/getAccounts';
import { CREATE_ACCOUNT, GET_ACCOUNTS, UPDATE_ACCOUNT } from '../graphql';
import { Permission } from '../types/graphql-global';
import { updateAccount, updateAccountVariables } from '../__generated__/updateAccount';
import { createAccount, createAccountVariables } from '../__generated__/createAccount';

const { Option } = Select;

interface EditAccount {
  id: UUID;
  name: string;
  mail: string;
  username: string;
  accountNumber: string;
  permission: Permission;
  useDigitalStamps: boolean;
  receivesMonthlyReport: boolean;
}

export default function AccountList() {
  const client = useApolloClient();
  const [editAccount, setEditAccount] = useState(null as EditAccount | null);
  const [updateForm] = Form.useForm();
  const [createAccount, setCreateAccount] = useState(false);
  const [createForm] = Form.useForm();
  const { loading, error, data } = useQuery<getAccounts>(GET_ACCOUNTS, {
    fetchPolicy: 'network-only',
  });

  if (error) {
    return <></>;
  }

  const dataSource = data?.getAccounts.map((it: any) => it.element) ?? [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Permisson',
      dataIndex: 'permission',
      key: 'permission',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Account number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Mail',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (name: string, record: getAccounts_getAccounts_element) => (
        <Button
          onClick={() =>
            setEditAccount({
              ...record,
            })
          }
        >
          Edit
        </Button>
      ),
    },
  ];

  const onUpdateCancel = () => {
    setEditAccount(null);
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
      };
      await client.mutate<updateAccount, updateAccountVariables>({
        mutation: UPDATE_ACCOUNT,
        variables,
      });
      setEditAccount(null);
    })();
  };

  let modal: any | null = null;
  if (editAccount) {
    updateForm.setFieldsValue({
      id: editAccount.id,
      name: editAccount.name,
      permission: editAccount.permission,
      username: editAccount.username,
      mail: editAccount.mail,
      accountNumber: editAccount.accountNumber,
    });
    modal = (
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
        </Form>
      </Modal>
    );
  }

  const onCreateCancel = () => {
    setCreateAccount(false);
  };
  const onCreateSave = (form: any) => {
    (async () => {
      const variables: createAccountVariables = {
        name: form.name,
        permission: form.permission,
        username: form.username,
        mail: form.mail,
        accountNumber: form.accountNumber,
      };
      await client.mutate<createAccount, createAccountVariables>({
        mutation: CREATE_ACCOUNT,
        variables,
      });
      setCreateAccount(false);
    })();
  };

  if (createAccount) {
    createForm.resetFields();
    modal = (
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
        </Form>
      </Modal>
    );
  }

  return (
    <>
      <Button onClick={() => setCreateAccount(true)}>Create Account</Button>
      <Table loading={loading} columns={columns} dataSource={dataSource} pagination={false} />
      {modal}
    </>
  );
}
