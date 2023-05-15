const { AuthenticationError, gql } = require("apollo-server");
const { Video } = require("../../models");

module.exports = {
  getVideosResolver: async (root, args, ctx) => {
    try {
      const { senderID, receiverID } = args;
      const videos = await Video.find({
        sender: senderID,
        receiver: receiverID,
      })
        .populate("sender")
        .populate("receiver");

      return videos;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
