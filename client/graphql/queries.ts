import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
      id
      title
      description
      amount
      type
      category
      paidBy {
        id
        username
      }
      splits {
        userId
        percent
        value
      }
      transactionDate
      createdAt
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;
