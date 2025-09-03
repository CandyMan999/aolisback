const { AuthenticationError } = require("apollo-server");
const { Like } = require("../../models");

module.exports = {
  getLikedUsersResolver: async (root, args) => {
    const { userID, skip = 0, limit = 10 } = args;

    try {
      const likes = await Like.find({ user: userID })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "liked",
            match: { isBanned: false },
            populate: [
              "room",
              "blockedUsers",
              "pictures",
              "sentVideos",
              "receivedVideos",
            ],
          },
          {
            path: "target",
            match: { isBanned: false },
            populate: [
              "room",
              "blockedUsers",
              "pictures",
              "sentVideos",
              "receivedVideos",
            ],
          },
        ]);

      return likes
        .map((like) => like.liked || like.target)
        .filter(Boolean);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
