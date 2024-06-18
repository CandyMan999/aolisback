const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers } = require("./graphQL");
const { cronJob } = require("./utils/cronJob");

const { findOrCreateUser } = require("./controllers/userController");

const mongoose = require("mongoose");
const { verifyToken } = require("./utils/middleware");
const { fetchMeResolver } = require("./graphQL/queries");

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

          if (!!authToken) {
            const result = await verifyToken({ token: authToken });
            if (result.id) {
              currentUser = await fetchMeResolver({}, { token: authToken });

              return { currentUser };
            }
          }
          return { currentUser };
        } catch (err) {
          console.error(
            `Uanable to authenticate user with token ${authToken}`,
            err
          );
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
// .then(() => {
//   cronJob();
// });
