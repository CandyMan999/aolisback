const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require("./controllers/userController");

const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async ({ req, connection }) => {
      if (connection) {
        // check connection for metadata
        return connection.context;
      } else {
        // check from req

        let authToken = null;
        let currentUser = null;

        try {
          authToken = req.headers.authorization;
        } catch (err) {
          console.error(`Uanable to authenticate user with token ${authToken}`);
        }
        return { currentUser };
      }
    },
  });

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(
      `Playground available at localhost:${port}${server.graphqlPath}`
    );
  });
};

startServer();
