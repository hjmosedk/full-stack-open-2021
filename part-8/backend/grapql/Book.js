const { gql } = require('apollo-server');

module.exports = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
`;
