const { AuthenticationError, PubSub } = require("apollo-server");
const { Video } = require("../../models");

const { publishCreateVideo } = require("../subscription/subscription");

module.exports = {
  flagVideoResolver: async (root, args, ctx) => {
    const { _id, flagged } = args;

    try {
      const video = await Video.findByIdAndUpdate(
        { _id },
        { flagged },
        { new: true }
      );

      const newVideo = await Video.findOne({ _id: video._id }).populate([
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

      publishCreateVideo(newVideo);

      return newVideo;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
