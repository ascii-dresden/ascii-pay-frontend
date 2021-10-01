import { gql } from '@apollo/client';

export const GET_SELF = gql`
  query getSelf {
    getSelf {
      id
      credit
      minimumCredit
      name
      mail
      username
      accountNumber
      permission
      receivesMonthlyReport
      allowNfcRegistration
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String, $password: String, $accountAccessToken: String) {
    login(username: $username, password: $password, accountAccessToken: $accountAccessToken) {
      token
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const GET_TRANSACTIONS = gql`
  query getTransactions($accountId: UUID!, $transactionFilterFrom: String!, $transactionFilterTo: String!) {
    getTransactions(
      accountId: $accountId
      transactionFilterFrom: $transactionFilterFrom
      transactionFilterTo: $transactionFilterTo
    ) {
      id
      total
      beforeCredit
      afterCredit
      date
      products {
        amount
        product {
          id
          name
          currentPrice
        }
      }
    }
  }
`;
