require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

const User = require('./models/userModel');

const { connectToMongo } = require('./configurations/conf');

const schema = require('./schema');

connectToMongo();

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
