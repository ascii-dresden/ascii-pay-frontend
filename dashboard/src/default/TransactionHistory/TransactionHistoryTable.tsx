import React from 'react';
import { Button, Table, Tag } from 'antd';
import moment from 'moment';
import { getOwnTransactions_getOwnTransactions } from '../../__generated__/getOwnTransactions';

type TransactionHistoryTableProps = {
  dataSource: getOwnTransactions_getOwnTransactions[];
};

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export function TransactionHistoryTable(props: TransactionHistoryTableProps) {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => moment(value).format(dateTimeFormat),
      sorter: (a: any, b: any) => moment(a.date).valueOf() - moment(b.date).valueOf(),
      sortDirections: ['ascend', 'descend'] as ('descend' | 'ascend' | null)[],
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (value: any[]) => <></>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => (value / 100).toFixed(2) + '€',
    },
    {
      title: 'Action',
      render: (text: any, record: any) => <Button type="link">Details</Button>,
    },
  ];
  return <Table columns={columns} dataSource={props.dataSource} pagination={false} />;
}
