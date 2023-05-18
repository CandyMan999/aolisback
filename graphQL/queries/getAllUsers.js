const { AuthenticationError, gql } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getAllUsersResolver: async (root, args, ctx) => {
    try {
      const users = await User.find({}).populate([
        "room",
        "blockedUsers",
        "pictures",
        "sentVideos",
        "receivedVideos",
      ]);

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
