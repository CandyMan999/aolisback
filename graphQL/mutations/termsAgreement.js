const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  termsAgreementResolver: async (root, args, ctx) => {
    const { accept } = args;
    const { currentUser } = ctx;

    try {
      const user = await User.findByIdAndUpdate(
        { _id: currentUser._id },
        { terms: accept },
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

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
