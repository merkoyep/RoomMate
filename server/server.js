const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/roommate',
      {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        retryReads: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('Please make sure MongoDB is running on your machine');
    process.exit(1);
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { req };
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      path: error.path,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    };
  },
});

async function startServer() {
  await connectDB();
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {
    const networkInterfaces = require('os').networkInterfaces();
    const addresses = [];
    for (const k in networkInterfaces) {
      for (const k2 in networkInterfaces[k]) {
        const address = networkInterfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }
    console.log(`🚀 Server running at:`);
    console.log(`   Local: http://localhost:${PORT}`);
    addresses.forEach((ip) => {
      console.log(`   Network: http://${ip}:${PORT}`);
    });
    console.log(
      `🚀 GraphQL endpoint at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();
