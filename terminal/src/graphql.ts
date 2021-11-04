import { gql } from '@apollo/client';

export const GET_SELF = gql`
  query getSelf {
    getSelf {
      id
      credit
      minimumCredit
      coffeeStamps
      bottleStamps
      name
      mail
      username
      accountNumber
      permission
      receivesMonthlyReport
      useDigitalStamps
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

export const SET_ACCOUNT_NUMBER = gql`
  mutation setAccountNumber($id: UUID!, $accountNumber: String!) {
    updateAccount(id: $id, input: { accountNumber: $accountNumber }) {
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
      coffeeStamps
      bottleStamps
    }
  }
`;

export const TRANSACTION = gql`
  mutation transaction(
    $accountAccessToken: String!
    $stopIfStampPaymentIsPossible: Boolean!
    $transactionItems: [PaymentItemInput!]!
  ) {
    transaction(
      input: {
        accountAccessToken: $accountAccessToken
        stopIfStampPaymentIsPossible: $stopIfStampPaymentIsPossible
        transactionItems: $transactionItems
      }
    ) {
      account {
        id
        name
        credit
        coffeeStamps
        bottleStamps
      }
      accountAccessToken
      error {
        message
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
      coffeeStamps
      beforeCoffeeStamps
      afterCoffeeStamps
      bottleStamps
      beforeBottleStamps
      afterBottleStamps
      date
      items {
        price
        payWithStamps
        giveStamps
        product {
          id
          name
          price
          payWithStamps
          giveStamps
          image
          category {
            name
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      nickname
      price
      payWithStamps
      giveStamps
      image
      flags
      category {
        name
      }
    }
  }
`;
