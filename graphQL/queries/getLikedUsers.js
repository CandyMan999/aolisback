const { AuthenticationError } = require("apollo-server");
const { Like } = require("../../models");

module.exports = {
  getLikedUsersResolver: async (root, args, ctx) => {
    const { userID, skip = 0, limit = 50 } = args;
    try {
      const likes = await Like.find({ user: userID })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "target",
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
        .filter((l) => l.target)
        .map((l) => l.target);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
