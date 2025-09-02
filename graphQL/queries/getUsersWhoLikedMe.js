const { AuthenticationError } = require("apollo-server");
const { Like } = require("../../models");

module.exports = {
  getUsersWhoLikedMeResolver: async (root, args, ctx) => {
    const { userID, skip = 0, limit = 50 } = args;
    try {
      const likes = await Like.find({ target: userID })
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

      return likes
        .filter((l) => l.user)
        .map((l) => l.user);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
