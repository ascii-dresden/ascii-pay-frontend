import { AccountOutput, TransactionOutput } from '../../model';
import { TransactionHistoryTimeRange } from './TransactionHistoryDatePicker';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../../graphql';
const dateFormat = 'YYYY-MM-DD';

export function useTransactionData(account: AccountOutput, timeRange: TransactionHistoryTimeRange) {
  const { data: transactionRawData, loading: transactionLoading } = useQuery(GET_TRANSACTIONS, {
    variables: {
      accountId: account.id,
      transactionFilterFrom: timeRange.start.format(dateFormat),
      transactionFilterTo: timeRange.end.format(dateFormat),
    },
  });

  const transactionData: TransactionOutput[] = (transactionRawData?.getTransactions ?? []).slice();
  transactionData.reverse();
  return { transactionLoading, transactionData };
}
