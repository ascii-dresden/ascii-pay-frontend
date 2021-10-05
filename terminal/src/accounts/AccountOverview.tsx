import React from 'react';
import { useQuery } from '@apollo/client';
import moment, { Moment } from 'moment';
import { GET_OWN_TRANSACTIONS } from '../graphql';
import { getOwnTransactions, getOwnTransactionsVariables } from '../__generated__/getOwnTransactions';
import AccountChart, { DiagramData } from './AccountChart';

import './AccountOverview.scss';

function useTransactionData(from: Moment, to: Moment) {
  const { data: transactionRawData, loading: transactionLoading } = useQuery<
    getOwnTransactions,
    getOwnTransactionsVariables
  >(GET_OWN_TRANSACTIONS, {
    variables: {
      transactionFilterFrom: from.format('YYYY-MM-DD'),
      transactionFilterTo: to.format('YYYY-MM-DD'),
    },
  });

  const transactionData = (transactionRawData?.getOwnTransactions ?? []).slice();
  transactionData.reverse();
  return { transactionLoading, transactionData };
}

export default function AccountOverview() {
  let timeRange = {
    start: moment().startOf('day').subtract(7, 'days'),
    end: moment().endOf('day'),
  };
  let { transactionLoading, transactionData } = useTransactionData(timeRange.start, timeRange.end);

  if (transactionLoading) {
    return <div>Loading</div>;
  }

  const diagramData: DiagramData[] = [];
  for (let item of transactionData) {
    diagramData.push({
      ...item,
      date: moment(item.date).valueOf(),
    });
  }

  if (diagramData.length > 0) {
    diagramData.splice(0, 0, {
      id: 'from',
      total: 0,
      beforeCredit: diagramData[0].beforeCredit,
      afterCredit: diagramData[0].beforeCredit,
      date: timeRange.start.valueOf(),
      products: [],
    });

    diagramData.push({
      id: 'to',
      total: 0,
      beforeCredit: diagramData[diagramData.length - 1].afterCredit,
      afterCredit: diagramData[diagramData.length - 1].afterCredit,
      date: timeRange.end.valueOf(),
      products: [],
    });
  }

  return (
    <div className="account-overview">
      <AccountChart diagramData={diagramData} />
    </div>
  );
}
