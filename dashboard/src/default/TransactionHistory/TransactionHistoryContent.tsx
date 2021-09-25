import { TransactionOutput } from '../../model';
import { DiagramData, TransactionHistoryChart } from './TransactionHistoryChart';
import { TransactionHistoryTable } from './TransactionHistoryTable';
import { Empty } from 'antd';
import React from 'react';
import moment from 'moment';
import { TransactionHistoryTimeRange } from './TransactionHistoryDatePicker';

export function TransactionHistoryContent({
  transactionData,
  timeRange,
}: {
  transactionData: TransactionOutput[];
  timeRange: TransactionHistoryTimeRange;
}) {
  const diagramData: DiagramData[] = [];
  const tableData: TransactionOutput[] = [];
  for (let item of transactionData) {
    diagramData.push({
      renderTooltip: true,
      ...item,
      date: moment(item.date).valueOf(),
    });
    tableData.push(item);
  }
  tableData.reverse();

  if (diagramData.length > 0) {
    diagramData.splice(0, 0, {
      renderTooltip: false,
      id: 'from',
      total: 0,
      beforeCredit: diagramData[0].beforeCredit,
      afterCredit: diagramData[0].beforeCredit,
      date: timeRange.start.valueOf(),
      products: [],
    });

    diagramData.push({
      renderTooltip: false,
      id: 'to',
      total: 0,
      beforeCredit: diagramData[diagramData.length - 1].afterCredit,
      afterCredit: diagramData[diagramData.length - 1].afterCredit,
      date: timeRange.end.valueOf(),
      products: [],
    });
  }

  return (
    <>
      {transactionData.length > 0 ? (
        <>
          <TransactionHistoryChart diagramData={diagramData} />
          <TransactionHistoryTable dataSource={tableData} />
        </>
      ) : (
        <>
          <Empty />
        </>
      )}
    </>
  );
}
