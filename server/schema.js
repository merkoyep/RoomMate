const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    transactions: [Transaction]
    wallets: [Wallet]
  }

  type Split {
    userId: ID!
    percent: Float!
    value: Float!
    user: User!
  }

  input SplitInput {
    userId: ID!
    percent: Float!
    value: Float!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    category: String!
    paidBy: User!
    splits: [Split!]!
    description: String
    createdAt: String!
    user: User!
  }

  type Wallet {
    id: ID!
    amount: Float!
    user: User!
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
    getTransactions: [Transaction]
    getWallets: [Wallet]
    getCategories: [Category]
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): LoginResponse
    createTransaction(
      title: String!
      amount: Float!
      type: String!
      category: String!
      paidBy: String!
      splits: [SplitInput!]!
      description: String
      date: String
      user: ID!
    ): Transaction
    updateTransaction(
      id: ID!
      title: String
      amount: Float
      type: String
      category: String
      paidBy: String
      splits: [SplitInput!]!
      description: String
      date: String
      user: ID!
    ): Transaction
    createCategory(name: String!): Category
  }
`;

module.exports = typeDefs;
