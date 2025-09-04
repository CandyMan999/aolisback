const { AuthenticationError } = require("apollo-server");
const { Like } = require("../../models");

module.exports = {
  getUsersWhoLikedMeResolver: async (root, args) => {
    const { userID, skip = 0, limit = 10 } = args;

    try {
      const likes = await Like.find({
        $or: [{ liked: userID }, { target: userID }],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "user",
          match: { isBanned: false },
          populate: [
            "room",
            "blockedUsers",
            "pictures",
            "sentVideos",
            "receivedVideos",
          ],
        });

      return likes.map((like) => like.user).filter(Boolean);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
