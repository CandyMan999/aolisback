const { AuthenticationError, gql } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getUsersMapResolver: async (root, args, ctx) => {
    try {
      const users = await User.find({
        "location.lat": { $ne: null },
        // isLoggedIn: true,
      })
        .populate("room")
        .populate("pictures")
        .populate("sentVideos")
        .populate("receivedVideos");

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
