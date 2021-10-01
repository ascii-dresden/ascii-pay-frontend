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
  mutation login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
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
  query getAccount($id: UUID) {
    getAccount(id: $id) {
      id
      name
      username
      accountNumber
      permission
    }
  }
`;
