require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const auth = require('./middleware/auth');
const AppModels = require('./models');

// Create an Express app and HTTP server
const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }), // Graceful shutdown plugin
  ],
});

// Define the Apollo-Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    playground: !IN_PROD,
    context: ({
        req
    }) => {

        let {
            user,
            isAuth,
        } = req;

        return {
            req,
            user,
            isAuth,
            ...AppModels,
        };
    }
});

async function startServer() {
  await server.start();

  // Middlewares
  app.use(express.json());
  app.use(cors());

  // GraphQL endpoint using expressMiddleware from Apollo Server
  app.use(
    '/graphql',
    expressMiddleware(server), // Apollo server middleware
  );

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      // Start the HTTP server
      httpServer.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}/graphql`);
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

startServer();
