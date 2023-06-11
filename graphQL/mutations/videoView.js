const { AuthenticationError, PubSub } = require("apollo-server");
const { Video } = require("../../models");

const { publishCreateVideo } = require("../subscription/subscription");

module.exports = {
  viewVideoResolver: async (root, args, ctx) => {
    const { _id, viewed } = args;

    try {
      const video = await Video.findByIdAndUpdate(
        {
          _id,
        },
        { viewed },
        { new: true }
      ).populate([
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
      ]);

      publishCreateVideo(video);

      return video;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
