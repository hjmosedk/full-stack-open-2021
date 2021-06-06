const { gql, UserInputError } = require('apollo-server');
const Author = require('../models/authorModel');
const Book = require('../models/bookModel');

const typeDef = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });

        try {
          const books = await Book.find({
            $and: [{ author: author._id }, { genres: { $in: args.genre } }],
          }).populate('author');
          return books;
        } catch (error) {
          throw new UserInputError('Invalid Input', { invalidArgs: args });
        }
      }

      if (args.genre) {
        try {
          return await Book.find({ genres: { $in: args.genre } }).populate(
            'author',
          );
        } catch (error) {
          throw new UserInputError('Invalid Input', { invalidArgs: args });
        }
      }

      if (args.author) {
        try {
          const author = await Author.findOne({ name: args.author });
          return await Book.find({ author: { $in: author._id } }).populate(
            'author',
          );
        } catch (error) {
          throw new UserInputError('Invalid Input', { invalidArgs: args });
        }
      }

      return await Book.find({}).populate('author');
    },
    allAuthors: () => Author.find({}).populate('books'),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
};

module.exports = { typeDef, resolvers };
