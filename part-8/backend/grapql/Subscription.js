const { gql } = require('apollo-server');

const { pubsub } = require('../configurations/conf');

const typeDef = gql`
  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

module.exports = { typeDef, resolvers };
