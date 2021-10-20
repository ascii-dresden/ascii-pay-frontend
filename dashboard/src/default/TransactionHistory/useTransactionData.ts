import { TransactionHistoryTimeRange } from './TransactionHistoryDatePicker';
import { useQuery } from '@apollo/client';
import { GET_OWN_TRANSACTIONS } from '../../graphql';
import { getOwnTransactions, getOwnTransactions_getOwnTransactions } from '../../__generated__/getOwnTransactions';
const dateFormat = 'YYYY-MM-DD';

export function useTransactionData(timeRange: TransactionHistoryTimeRange) {
  const { data: transactionRawData, loading: transactionLoading } = useQuery<getOwnTransactions>(GET_OWN_TRANSACTIONS, {
    variables: {
      transactionFilterFrom: timeRange.start.format(dateFormat),
      transactionFilterTo: timeRange.end.format(dateFormat),
    },
  });

  const transactionData: getOwnTransactions_getOwnTransactions[] = (
    transactionRawData?.getOwnTransactions ?? []
  ).slice();
  transactionData.reverse();
  return { transactionLoading, transactionData };
}
