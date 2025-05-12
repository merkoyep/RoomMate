import { gql } from '@apollo/client';

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $title: String!
    $amount: Float!
    $type: String!
    $category: String!
    $paidBy: String!
    $splits: [SplitInput!]!
    $description: String
    $user: ID!
  ) {
    createTransaction(
      title: $title
      amount: $amount
      type: $type
      category: $category
      paidBy: $paidBy
      splits: $splits
      description: $description
      user: $user
    ) {
      id
      title
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
      description
      createdAt
      user {
        id
        username
      }
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction(
    $id: ID!
    $title: String
    $amount: Float
    $type: String
    $category: String
    $paidBy: String
    $splits: [SplitInput!]!
    $description: String
    $user: ID!
  ) {
    updateTransaction(
      id: $id
      title: $title
      amount: $amount
      type: $type
      category: $category
      paidBy: $paidBy
      splits: $splits
      description: $description
      user: $user
    ) {
      id
      title
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
      description
      createdAt
      user {
        id
        username
      }
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      id
    }
  }
`;
