const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const { pushNotificationNewMatch } = require("../../utils/middleware");

module.exports = {
  likeResolver: async (root, args, ctx) => {
    const { userID, likeID } = args;

    try {
      // Find the user
      const user = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);

      // Check if the likeID is already in the user's likedUsers array

      const isAlreadyLiked = user.likedUsers.some(
        (user) => user._id.toString() === likeID
      );

      if (isAlreadyLiked) {
        // They already liked the user
        return user;
      }

      // Check if the likedUser has already liked the current user
      const likedUser = await User.findById(likeID);

      const isMutualLike = likedUser.likedUsers.some(
        (user) => user._id.toString() === userID
      );

      if (isMutualLike) {
        // If mutual like, add each other to matchedUsers array
        await User.findByIdAndUpdate(
          userID,
          {
            $push: { likedUsers: likeID, matchedUsers: likeID },
            $inc: { "plan.likesSent": 1 },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(likeID, {
          $push: { usersLikedMe: userID },
        });
        await User.findByIdAndUpdate(
          likeID,
          { $push: { matchedUsers: userID } },
          { new: true }
        );

        pushNotificationNewMatch(user.username, likedUser.expoToken);
      } else {
        // Add the likeID to the user's likedUsers array
        await User.findByIdAndUpdate(
          userID,
          {
            $push: { likedUsers: likeID },
            $inc: { "plan.likesSent": 1 },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(likeID, {
          $push: { usersLikedMe: userID },
        });
      }

      // Return the updated user
      const updatedUser = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);
      return updatedUser;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  unLikeResolver: async (root, args, ctx) => {
    const { userID, unLikeID } = args;
    try {
      // Remove the likeID from the user's likedUsers array
      const user = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);

      // If they were matched, remove each other from matchedUsers array
      const isMatched = user.matchedUsers.some(
        (user) => user._id.toString() === unLikeID
      );

      if (isMatched) {
        const userWithoutMatch = await User.findByIdAndUpdate(
          userID,
          { $pull: { matchedUsers: unLikeID, likedUsers: unLikeID } },
          { new: true }
        ).populate(["pictures", "blockedUsers", "likedUsers", "matchedUsers"]);
        await User.findByIdAndUpdate(unLikeID, {
          $pull: { matchedUsers: userID, usersLikedMe: userID },
        });
        return userWithoutMatch;
      } else {
        const newUser = await User.findByIdAndUpdate(
          userID,
          { $pull: { likedUsers: unLikeID } },
          { new: true }
        ).populate(["pictures", "blockedUsers", "likedUsers", "matchedUsers"]);

        await User.findByIdAndUpdate(unLikeID, {
          $pull: { usersLikedMe: userID },
        });

        return newUser;
      }
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
