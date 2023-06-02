const { AuthenticationError, gql } = require("apollo-server");
const { User } = require("../../models");
const { verifyToken } = require("../../utils/middleware");
const moment = require("moment");

module.exports = {
  fetchMeResolver: async (root, args, ctx) => {
    const { token } = args;

    try {
      const { id } = await verifyToken({ token });
      if (!id) {
        throw new AuthenticationError("Unathenticated off token: ", token);
      }

      const user = await User.findOneAndUpdate(
        { _id: id },
        { isLoggedIn: true, roomInfo: { subscribedAt: moment() } },
        { new: true }
      ).populate([
        "pictures",
        "comments",
        "sentVideos",
        "blockedUsers",
        "receivedVideos",
        {
          path: "sentVideos",
          populate: [
            {
              path: "sender",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
            {
              path: "receiver",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
          ],
        },
        {
          path: "receivedVideos",
          populate: [
            "blockedUsers",
            {
              path: "sender",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
            {
              path: "receiver",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
          ],
        },
      ]);

      if (!user) {
        return new AuthenticationError("Username Doesn't Exsist");
      }

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
