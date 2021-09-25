import { TransactionOutput } from '../../model';
import { Col, Statistic } from 'antd';
import { red } from '@ant-design/colors';
import { ArrowDownOutlined } from '@ant-design/icons';
import React from 'react';

export function TransactionHistoryStats(props: { transactionData: TransactionOutput[] }) {
  let spent = 0;
  for (let item of props.transactionData) {
    if (item.total < 0) {
      spent -= item.total;
    }
  }
  return (
    <Col span={8}>
      {props.transactionData.length > 0 ? (
        <>
          <Statistic
            title="Amount spent"
            value={(spent / 100).toFixed(2)}
            valueStyle={{ color: red[5] }}
            prefix={<ArrowDownOutlined />}
            suffix="€"
          />
        </>
      ) : (
        <></>
      )}
    </Col>
  );
}
