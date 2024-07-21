const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  likeResolver: async (root, args, ctx) => {
    const { userID, likeID } = args;
    try {
      const user = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);

      const likedUser = await User.findById(likeID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);

      if (!user || !likedUser) {
        throw new AuthenticationError("User not found");
      }

      // Check if the likeID is in the user's likedUsers array
      const isAlreadyLiked = user.likedUsers.includes(likeID);

      // Add likeID to user's likedUsers array if not already liked
      if (!isAlreadyLiked) {
        await User.findByIdAndUpdate(
          userID,
          { $push: { likedUsers: likeID } },
          { new: true }
        );
      }

      // Check if the userID is in the likedUser's likedUsers array
      const isMatch = likedUser.likedUsers.includes(userID);

      if (isMatch) {
        // Add each other to matchedUsers array if there is a match
        await User.findByIdAndUpdate(
          userID,
          { $addToSet: { matchedUsers: likeID } },
          { new: true }
        );

        await User.findByIdAndUpdate(
          likeID,
          { $addToSet: { matchedUsers: userID } },
          { new: true }
        );
      }

      return await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  unLikeResolver: async (root, args, ctx) => {
    const { userID, likeID } = args;
    try {
      const user = await User.findByIdAndUpdate(
        userID,
        { $pull: { likedUsers: likeID, matchedUsers: likeID } },
        { new: true }
      ).populate(["pictures", "blockedUsers", "likedUsers", "matchedUsers"]);

      await User.findByIdAndUpdate(
        likeID,
        { $pull: { matchedUsers: userID } },
        { new: true }
      );

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
