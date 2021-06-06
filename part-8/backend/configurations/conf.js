const { PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const pubsub = new PubSub();

const connectToMongo = () => {
  console.log('Connection to: ', process.env.MONGODB_URI);

  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.log('Error connection to MongoDB', error.message);
    });
};

module.exports = { pubsub, connectToMongo };
