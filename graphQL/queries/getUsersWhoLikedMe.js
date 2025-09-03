const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getUsersWhoLikedMeResolver: async (root, args, ctx) => {
    const { userID, skip = 0, limit = 10 } = args; // Assuming you pass the userId as an argument to this resolver

    try {
      // Find the user by userId to get the list of likedUsers
      const currentUser = await User.findById(userID).select("usersLikedMe");

      if (!currentUser) {
        throw new Error("User not found");
      }

      if (currentUser.usersLikedMe && !currentUser.usersLikedMe.length) {
        return [];
      }

      const likedUserIds = currentUser.usersLikedMe.map((user) => user._id);

      // Fetch the liked users from the User model
      const likedUsers = await User.find({
        _id: { $in: likedUserIds },
        isBanned: false,
      })
        .skip(skip)
        .limit(limit)
        .populate([
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
