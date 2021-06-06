const { gql } = require('apollo-server');

const typeDef = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
`;

const resolvers = {
  Author: {
    bookCount: (root) => root.books.length,
  },
};

module.exports = { typeDef, resolvers };
