import React, { useState } from 'react';
import './AccountList.scss';
import { Table, Button, Space, Tag } from 'antd';
import { useQuery } from '@apollo/client';
import { getAccounts, getAccounts_getAccounts_element, getAccountsVariables } from '../__generated__/getAccounts';
import { GET_ACCOUNTS } from '../graphql';
import { Permission } from '../types/graphql-global';
import Search from 'antd/lib/input/Search';
import Money from '../default/Money';
import AccountCreateDialog from './AccountCreateDialog';
import AccountEditDialog from './AccountEditDialog';
import AccountPaymentDialog from './AccountPaymentDialog';

export interface EditAccount {
  id: UUID;
  name: string;
  mail: string;
  username: string;
  accountNumber: string;
  permission: Permission;
  useDigitalStamps: boolean;
  receivesMonthlyReport: boolean;
  minimumCredit: number;
  isPasswordSet: boolean;
  nfcTokens: {
    cardId: string;
    cardType: string;
    name: string;
  }[];
}

enum DialogMode {
  CREATE,
  EDIT,
  PAYMENT,
}

export default function AccountList() {
  const [searchString, setSearchString] = useState('');

  const [dialogMode, setDialogMode] = useState(
    null as {
      mode: DialogMode;
      account: EditAccount | null;
    } | null
  );

  const { loading, error, data } = useQuery<getAccounts, getAccountsVariables>(GET_ACCOUNTS, {
    fetchPolicy: 'network-only',
    variables: {
      search: searchString,
    },
  });

  if (error) {
    return <></>;
  }

  const dataSource =
    data?.getAccounts.map((it: any) => {
      return {
        key: it.element.id,
        ...it.element,
      };
    }) ?? [];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_name: string, record: getAccounts_getAccounts_element) => {
        let tag;
        switch (record.permission) {
          case Permission.ADMIN:
            tag = <Tag color="volcano">Admin</Tag>;
            break;
          case Permission.MEMBER:
            tag = <Tag color="blue">Member</Tag>;
            break;
          case Permission.DEFAULT:
            tag = <Tag>Default</Tag>;
            break;
        }
        return (
          <Space>
            <span>{record.name}</span>
            {tag}
          </Space>
        );
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Credit',
      key: 'credit',
      render: (_name: string, record: getAccounts_getAccounts_element) => (
        <Money key="account-list-credit" value={record.credit} />
      ),
    },
    {
      title: 'Stamps',
      key: 'stamps',
      render: (_name: string, record: getAccounts_getAccounts_element) => (
        <span>
          {record.bottleStamps}B | {record.coffeeStamps}C
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'id',
      render: (_name: string, record: getAccounts_getAccounts_element) => (
        <Space>
          <Button
            key="account-list-edit-button"
            onClick={() =>
              setDialogMode({
                mode: DialogMode.EDIT,
                account: {
                  ...record,
                },
              })
            }
          >
            Edit
          </Button>
          <Button
            key="account-list-transaction-button"
            onClick={() =>
              setDialogMode({
                mode: DialogMode.PAYMENT,
                account: {
                  ...record,
                },
              })
            }
          >
            Payment
          </Button>
        </Space>
      ),
    },
  ] as any[];

  let modal: any | null = null;

  switch (dialogMode?.mode) {
    case DialogMode.CREATE:
      modal = <AccountCreateDialog closeDialog={() => setDialogMode(null)} />;
      break;
    case DialogMode.EDIT:
      modal = <AccountEditDialog account={dialogMode.account!} closeDialog={() => setDialogMode(null)} />;
      break;
    case DialogMode.PAYMENT:
      modal = <AccountPaymentDialog account={dialogMode.account!} closeDialog={() => setDialogMode(null)} />;
      break;
  }

  return (
    <Space direction="vertical">
      <Space>
        <Search placeholder="Search account" allowClear onSearch={setSearchString} />
        <Button
          onClick={() =>
            setDialogMode({
              mode: DialogMode.CREATE,
              account: null,
            })
          }
        >
          Create Account
        </Button>
      </Space>
      <Table loading={loading} columns={columns} dataSource={dataSource} pagination={false} />
      {modal}
    </Space>
  );
}
