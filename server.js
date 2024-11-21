require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors');
const { listEmployees, getEmployee } = require('./resolvers/Query');
const { addEmployee, updateEmployee } = require('./resolvers/Mutation');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const auth = require('./middleware/auth');
const AppModels = require('./models');
const routes = require('./routes');
const swaggerOptions = require('./config/swagger');

// Create an Express app and HTTP server
const app = express();
const httpServer = http.createServer(app);

// Middleware for cookies
app.use(cookieParser());


// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
  context: ({ req }) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    let user = null;

    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        console.error('Invalid token:', err.message);
      }
    }

    return { user, ...AppModels };
  },
});

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  await server.start();

  // Middlewares
  app.use(express.json());
  app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

  // Apply GraphQL endpoint middleware
  app.use('/graphql', expressMiddleware(server));
  // Use the combined routes
  app.use(routes);
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      httpServer.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}/`);
        console.log(`View docs on http://localhost:${process.env.PORT}/api-docs`);
      });
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

startServer();
