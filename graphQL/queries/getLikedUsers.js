const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getLikedUsersResolver: async (root, args, ctx) => {
    const { userID } = args; // Assuming you pass the userId as an argument to this resolver

    try {
      // Find the user by userId to get the list of likedUsers
      const currentUser = await User.findById(userID).select("likedUsers");

      if (!currentUser) {
        throw new Error("User not found");
      }

      if (currentUser.likedUsers && !currentUser.likedUsers.length) {
        return [];
      }
      const likedUserIds = currentUser.likedUsers.map((user) => user._id);

      // Fetch the liked users from the User model
      const likedUsers = await User.find({
        _id: { $in: likedUserIds },
        isBanned: false,
      }).populate([
        "room",
        "blockedUsers",
        "pictures",
        "sentVideos",
        "receivedVideos",
      ]);

      return likedUsers;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
