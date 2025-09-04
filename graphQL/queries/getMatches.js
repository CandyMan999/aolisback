const { AuthenticationError } = require("apollo-server");
const { Match } = require("../../models");

module.exports = {
  getMatchedUsersResolver: async (root, args) => {
    const { userID, skip = 0, limit = 10 } = args;

    try {
      const matches = await Match.find({ users: userID })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "users",
          match: { isBanned: false },
          populate: [
            "room",
            "blockedUsers",
            "pictures",
            "sentVideos",
            "receivedVideos",
          ],
        });

      return matches
        .map((match) => match.users.find((u) => u._id.toString() !== userID))
        .filter(Boolean);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
