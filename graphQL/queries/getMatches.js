const { AuthenticationError } = require("apollo-server");
const { Match } = require("../../models");

module.exports = {
  getMatchedUsersResolver: async (root, args, ctx) => {
    const { userID, skip = 0, limit = 50 } = args;
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

      const users = [];
      matches.forEach((m) => {
        const other = m.users.find((u) => u && u._id.toString() !== userID);
        if (other) users.push(other);
      });

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
