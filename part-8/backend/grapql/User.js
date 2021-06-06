const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
`;
