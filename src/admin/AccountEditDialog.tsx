import React, { useRef } from 'react';
import { Modal, Form, Input, Divider, Select, Button } from 'antd';
import { EditAccount } from './AccountList';
import { updateAccount, updateAccountVariables } from '../__generated__/updateAccount';
import { useApolloClient } from '@apollo/client';
import {
  DELETE_ACCOUNT_NFC_CARD,
  DELETE_ACCOUNT_PASSWORD,
  GET_ACCOUNTS,
  SET_ACCOUNT_PASSWORD,
  UPDATE_ACCOUNT,
} from '../graphql';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteAccountPassword, deleteAccountPasswordVariables } from '../__generated__/deleteAccountPassword';
import { deleteAccountNfcCard, deleteAccountNfcCardVariables } from '../__generated__/deleteAccountNfcCard';
import { setAccountPassword, setAccountPasswordVariables } from '../__generated__/setAccountPassword';

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

  let removePassword = () => {
    (async () => {
      try {
        await client.mutate<deleteAccountPassword, deleteAccountPasswordVariables>({
          mutation: DELETE_ACCOUNT_PASSWORD,
          variables: {
            id: props.account.id,
          },
        });

        client.refetchQueries({
          include: [GET_ACCOUNTS],
        });
        props.closeDialog();
      } catch (e) {
        console.error(e);
      }
    })();
  };

  let removeNfcToken = (cardId: string) => {
    (async () => {
      try {
        await client.mutate<deleteAccountNfcCard, deleteAccountNfcCardVariables>({
          mutation: DELETE_ACCOUNT_NFC_CARD,
          variables: {
            id: props.account.id,
            cardId,
          },
        });

        client.refetchQueries({
          include: [GET_ACCOUNTS],
        });
        props.closeDialog();
      } catch (e) {
        console.error(e);
      }
    })();
  };

  let auth: any[] = [];
  let passwordRef = useRef<Input>(null);

  let setPassword = () => {
    (async () => {
      try {
        await client.mutate<setAccountPassword, setAccountPasswordVariables>({
          mutation: SET_ACCOUNT_PASSWORD,
          variables: {
            id: props.account.id,
            newPassword: passwordRef.current?.input.value ?? '',
          },
        });

        client.refetchQueries({
          include: [GET_ACCOUNTS],
        });
        props.closeDialog();
      } catch (e) {
        console.error(e);
      }
    })();
  };

  if (props.account.isPasswordSet) {
    auth.push(
      <Form.Item key="password" label="Password" name="password">
        <Input.Group compact>
          <Input style={{ width: '80%' }} value="Is set" />
          <Button style={{ width: '20%' }} onClick={() => removePassword()} icon={<DeleteOutlined />} />
        </Input.Group>
      </Form.Item>
    );
  } else {
    auth.push(
      <Form.Item key="password" label="Password" name="password">
        <Input.Group compact>
          <Input ref={passwordRef} type="password" style={{ width: '80%' }} placeholder="Password" />
          <Button style={{ width: '20%' }} onClick={() => setPassword()} icon={<PlusOutlined />} />
        </Input.Group>
      </Form.Item>
    );
  }

  auth.push(
    ...props.account.nfcTokens.map((token) => {
      return (
        <Form.Item key={'nfc-' + token.cardId} label="NFC Token" name={'nfc-' + token.cardId}>
          <Input.Group compact>
            <Input style={{ width: '80%' }} value={token.name + ': ' + token.cardId} />
            <Button style={{ width: '20%' }} onClick={() => removeNfcToken(token.cardId)} icon={<DeleteOutlined />} />
          </Input.Group>
        </Form.Item>
      );
    })
  );

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
        <Divider />
        {auth}
      </Form>
    </Modal>
  );
}
