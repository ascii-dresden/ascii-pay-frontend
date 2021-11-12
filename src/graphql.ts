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

export const GET_ACCOUNTS = gql`
  query getAccounts {
    getAccounts {
      element {
        id
        credit
        minimumCredit
        name
        mail
        username
        accountNumber
        permission
        useDigitalStamps
        coffeeStamps
        bottleStamps
        receivesMonthlyReport
      }
    }
  }
`;

export const GET_ACCOUNT = gql`
  query getAccount($id: UUID!) {
    getAccount(id: $id) {
      id
      credit
      minimumCredit
      name
      mail
      username
      accountNumber
      permission
      useDigitalStamps
      coffeeStamps
      bottleStamps
      receivesMonthlyReport
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount(
    $id: UUID!
    $name: String
    $permission: Permission
    $username: String
    $mail: String
    $accountNumber: String
    $minimumCredit: Int
    $useDigitalStamps: Boolean
    $receivesMonthlyReport: Boolean
  ) {
    updateAccount(
      id: $id
      input: {
        name: $name
        permission: $permission
        username: $username
        mail: $mail
        accountNumber: $accountNumber
        minimumCredit: $minimumCredit
        useDigitalStamps: $useDigitalStamps
        receivesMonthlyReport: $receivesMonthlyReport
      }
    ) {
      id
      credit
      minimumCredit
      name
      mail
      username
      accountNumber
      permission
      useDigitalStamps
      coffeeStamps
      bottleStamps
      receivesMonthlyReport
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $name: String!
    $permission: Permission!
    $username: String
    $mail: String
    $accountNumber: String
    $minimumCredit: Int
    $useDigitalStamps: Boolean
    $receivesMonthlyReport: Boolean
  ) {
    createAccount(
      input: {
        name: $name
        permission: $permission
        username: $username
        mail: $mail
        accountNumber: $accountNumber
        minimumCredit: $minimumCredit
        useDigitalStamps: $useDigitalStamps
        receivesMonthlyReport: $receivesMonthlyReport
      }
    ) {
      id
      credit
      minimumCredit
      name
      mail
      username
      accountNumber
      permission
      useDigitalStamps
      coffeeStamps
      bottleStamps
      receivesMonthlyReport
    }
  }
`;
