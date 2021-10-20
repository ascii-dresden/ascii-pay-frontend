import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { Card, Row, Space } from 'antd';
import { TransactionHistoryContent } from './TransactionHistoryContent';
import { TransactionHistoryDatePicker, TransactionHistoryTimeRange } from './TransactionHistoryDatePicker';
import { TransactionHistoryStats } from './TransactionHistoryStats';
import { useTransactionData } from './useTransactionData';

export function TransactionHistory() {
  const [timeRange, setTimeRange] = useState({
    start: moment().startOf('day').subtract(7, 'days'),
    end: moment().endOf('day'),
  } as TransactionHistoryTimeRange);

  const { transactionLoading, transactionData } = useTransactionData(timeRange);

  let onDatePickerChange = (dates: [Moment | null, Moment | null] | null) => {
    if (dates === null) {
      setTimeRange({
        start: moment(0),
        end: moment(0),
      });
      return;
    }
    setTimeRange({
      start: dates[0] ?? moment(0),
      end: dates[1] ?? moment(0),
    });
  };
  return (
    <Card loading={transactionLoading}>
      <Space size={32} direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16} align="middle">
          <TransactionHistoryDatePicker timeRange={timeRange} onChange={onDatePickerChange} />
          <TransactionHistoryStats transactionData={transactionData} />
        </Row>

        <TransactionHistoryContent transactionData={transactionData} timeRange={timeRange} />
      </Space>
    </Card>
  );
}
