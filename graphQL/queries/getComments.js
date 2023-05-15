const { AuthenticationError, gql } = require("apollo-server");
const { Comment } = require("../../models");

module.exports = {
  getCommentsResolver: async (root, args, ctx) => {
    const { roomId } = args;

    try {
      const comments = await Comment.find({ room: roomId })
        .populate({
          path: "author",
          populate: [{ path: "pictures", model: "Picture" }],
        })
        .populate("room");

      return comments;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
