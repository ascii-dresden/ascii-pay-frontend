import React from 'react';
import { DiagramData, TransactionHistoryChart } from './TransactionHistoryChart';
import { TransactionHistoryTable } from './TransactionHistoryTable';
import { Empty } from 'antd';
import moment from 'moment';
import { TransactionHistoryTimeRange } from './TransactionHistoryDatePicker';
import { getTransactions_getTransactions } from '../../__generated__/getTransactions';

export function TransactionHistoryContent({
  transactionData,
  timeRange,
}: {
  transactionData: getTransactions_getTransactions[];
  timeRange: TransactionHistoryTimeRange;
}) {
  const diagramData: DiagramData[] = [];
  const tableData: getTransactions_getTransactions[] = [];
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
      coffeeStamps: 0,
      beforeCoffeeStamps: diagramData[0].beforeCoffeeStamps,
      afterCoffeeStamps: diagramData[0].beforeCoffeeStamps,
      bottleStamps: 0,
      beforeBottleStamps: diagramData[0].beforeBottleStamps,
      afterBottleStamps: diagramData[0].beforeBottleStamps,
      date: timeRange.start.valueOf(),
      items: [],
    });

    diagramData.push({
      renderTooltip: false,
      id: 'to',
      total: 0,
      beforeCredit: diagramData[diagramData.length - 1].afterCredit,
      afterCredit: diagramData[diagramData.length - 1].afterCredit,
      coffeeStamps: 0,
      beforeCoffeeStamps: diagramData[diagramData.length - 1].afterCoffeeStamps,
      afterCoffeeStamps: diagramData[diagramData.length - 1].afterCoffeeStamps,
      bottleStamps: 0,
      beforeBottleStamps: diagramData[diagramData.length - 1].afterBottleStamps,
      afterBottleStamps: diagramData[diagramData.length - 1].afterBottleStamps,
      date: timeRange.end.valueOf(),
      items: [],
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
