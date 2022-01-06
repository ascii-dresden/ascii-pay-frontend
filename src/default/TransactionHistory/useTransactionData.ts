import { TransactionHistoryTimeRange } from './TransactionHistoryDatePicker';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../../graphql';
import { getTransactions, getTransactions_getTransactions } from '../../__generated__/getTransactions';
const dateFormat = 'YYYY-MM-DD';

export function useTransactionData(timeRange: TransactionHistoryTimeRange) {
  const { data: transactionRawData, loading: transactionLoading } = useQuery<getTransactions>(GET_TRANSACTIONS, {
    variables: {
      transactionFilterFrom: timeRange.start.format(dateFormat),
      transactionFilterTo: timeRange.end.format(dateFormat),
    },
  });

  const transactionData: getTransactions_getTransactions[] = (transactionRawData?.getTransactions ?? []).slice();
  transactionData.reverse();
  return { transactionLoading, transactionData };
}
