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

export const GET_ACCOUNTS = gql`
  query getAccounts {
    getAccounts {
      element {
        id
        name
        permission
      }
    }
  }
`;

export const GET_ACCOUNT = gql`
  query getAccount($id: UUID!) {
    getAccount(id: $id) {
      id
      name
      username
      accountNumber
      permission
    }
  }
`;

export const GET_ACCOUNT_BY_ACCESS_TOKEN = gql`
  query getAccountByAccessToken($accountAccessToken: String!) {
    getAccountByAccessToken(accountAccessToken: $accountAccessToken) {
      id
      name
      credit
    }
  }
`;

export const TRANSACTION = gql`
  mutation transaction($accountAccessToken: String!, $amount: Int!, $products: [PaymentProductInput!]!) {
    transaction(input: { accountAccessToken: $accountAccessToken, amount: $amount, products: $products }) {
      account {
        id
        name
        credit
      }
    }
  }
`;

export const GET_OWN_TRANSACTIONS = gql`
  query getOwnTransactions($transactionFilterFrom: String!, $transactionFilterTo: String!) {
    getOwnTransactions(transactionFilterFrom: $transactionFilterFrom, transactionFilterTo: $transactionFilterTo) {
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

export const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      element {
        id
        name
        currentPrice
        image
        category {
          id
          name
        }
      }
    }
  }
`;
