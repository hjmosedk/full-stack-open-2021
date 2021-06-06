const { makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');

const {
  typeDef: Author,
  resolvers: authorResolvers,
} = require('./grapql/Author');
const Book = require('./grapql/Book');
const User = require('./grapql/User');
const { typeDef: Query, resolvers: queryResolvers } = require('./grapql/Query');
const {
  typeDef: Mutations,
  resolvers: mutationsResolvers,
} = require('./grapql/Mutations');
const {
  typeDef: Subscriptions,
  resolvers: subscriptionsResolvers,
} = require('./grapql/Subscription');

const schema = makeExecutableSchema({
  typeDefs: [Author, Book, User, Query, Mutations, Subscriptions],
  resolvers: merge(
    queryResolvers,
    authorResolvers,
    mutationsResolvers,
    subscriptionsResolvers,
  ),
});

module.exports = schema;
