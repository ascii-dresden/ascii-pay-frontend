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
