const { gql, UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { pubsub } = require('../configurations/conf');

const Author = require('../models/authorModel');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

const typeDef = gql`
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      let author = await Author.findOne({ name: args.author });
      const bookIsInLibrary = await Book.findOne({ title: args.title });

      if (!currentUser) {
        throw new AuthenticationError('Not authorized to do that action');
      }

      if (bookIsInLibrary) {
        throw new UserInputError(
          'Book have already been added to library - title must be unique',
          { invalidArgs: args },
        );
      }

      if (!author) {
        author = new Author({ name: args.author });
        await author.save().catch((error) => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        });
      }

      const book = new Book({ ...args, author });
      await book.save().catch((error) => {
        throw new UserInputError(error.message, { invalidArgs: args });
      });

      author.books = author.books.concat(book._id);
      await author.save();

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.name });

      if (!currentUser) {
        throw new AuthenticationError('Not authorized to do that action');
      }

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      await author.save();
      return author;
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'password') {
        throw new UserInputError('Wrong username or password');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

module.exports = { typeDef, resolvers };
