import { gql } from '@apollo/client';

export const GET_ACCOUNT = gql`
  query getAccount($id: UUID) {
    getAccount(id: $id) {
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
      isPasswordSet
      nfcTokens {
        cardId
        cardType
        name
      }
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
  query getTransactions($accountId: UUID, $transactionFilterFrom: String!, $transactionFilterTo: String!) {
    getTransactions(
      accountId: $accountId
      transactionFilterFrom: $transactionFilterFrom
      transactionFilterTo: $transactionFilterTo
    ) {
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
  query getAccounts($search: String) {
    getAccounts(search: $search) {
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
        isPasswordSet
        nfcTokens {
          cardId
          cardType
          name
        }
      }
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

export const GET_ACCOUNT_ACCESS_TOKEN = gql`
  mutation getAccountAccessToken($id: UUID!) {
    getAccountAccessToken(id: $id) {
      token
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

export const SET_ACCOUNT_PASSWORD = gql`
  mutation setAccountPassword($id: UUID!, $oldPassword: String, $newPassword: String!) {
    setAccountPassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const DELETE_ACCOUNT_PASSWORD = gql`
  mutation deleteAccountPassword($id: UUID!) {
    deleteAccountPassword(id: $id)
  }
`;

export const DELETE_ACCOUNT_NFC_CARD = gql`
  mutation deleteAccountNfcCard($id: UUID!, $cardId: String!) {
    deleteAccountNfcCard(id: $id, cardId: $cardId)
  }
`;
