const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const { pushNotificationNewMatch } = require("../../utils/middleware");

const MAX_RELATIONS = 300;

const trimUserRelations = async (id) => {
  const user = await User.findById(id).select(
    "likedUsers usersLikedMe matchedUsers"
  );
  if (!user) return;

  if (user.likedUsers.length > MAX_RELATIONS) {
    const nonMatch = user.likedUsers.find(
      (u) => !user.matchedUsers.map((m) => m.toString()).includes(u.toString())
    );
    if (nonMatch) {
      await User.findByIdAndUpdate(id, { $pull: { likedUsers: nonMatch } });
      await User.findByIdAndUpdate(nonMatch, { $pull: { usersLikedMe: id } });
    }
  }

  if (user.usersLikedMe.length > MAX_RELATIONS) {
    const oldest = user.usersLikedMe[0];
    await User.findByIdAndUpdate(id, { $pull: { usersLikedMe: oldest } });
    await User.findByIdAndUpdate(oldest, { $pull: { likedUsers: id } });
  }

  if (user.matchedUsers.length > MAX_RELATIONS) {
    const oldestMatch = user.matchedUsers[0];
    await User.findByIdAndUpdate(id, {
      $pull: { matchedUsers: oldestMatch, likedUsers: oldestMatch },
    });
    await User.findByIdAndUpdate(oldestMatch, {
      $pull: { matchedUsers: id, likedUsers: id, usersLikedMe: id },
    });
  }
};

module.exports = {
  likeResolver: async (root, args, ctx) => {
    const { userID, likeID } = args;

    try {
      // Find the user
      let user = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);

      // Check if the likeID is already in the user's likedUsers array
      const isAlreadyLiked = user.likedUsers.some(
        (likedUser) => likedUser._id.toString() === likeID
      );

      if (isAlreadyLiked) {
        // They already liked the user

        return user;
      }

      // Check if the likedUser has already liked the current user
      const likedUser = await User.findById(likeID);

      const isMutualLike = likedUser.likedUsers.some(
        (likedUser) => likedUser._id.toString() === userID
      );

      if (isMutualLike) {
        // If mutual like, add each other to matchedUsers array
        if (user.plan.likesSent < user.plan.likes) {
          // Increment likesSent if still within the plan's allowed likes
          await User.findByIdAndUpdate(
            userID,
            {
              $push: { likedUsers: likeID, matchedUsers: likeID },
              $inc: { "plan.likesSent": 1 },
            },
            { new: true }
          );
        } else if (
          user.plan.likesSent >= user.plan.likes &&
          user.plan.additionalLikes > 0
        ) {
          // Use additionalLikes if the plan's allowed likes are exhausted
          await User.findByIdAndUpdate(
            userID,
            {
              $push: { likedUsers: likeID, matchedUsers: likeID },
              $inc: { "plan.additionalLikes": -1 },
            },
            { new: true }
          );
        }
        await User.findByIdAndUpdate(likeID, {
          $push: { usersLikedMe: userID, matchedUsers: userID },
        });

        pushNotificationNewMatch(user.username, likedUser.expoToken);
      } else {
        // Regular like flow
        if (user.plan.likesSent < user.plan.likes) {
          // Increment likesSent if still within the plan's allowed likes
          await User.findByIdAndUpdate(
            userID,
            {
              $push: { likedUsers: likeID },
              $inc: { "plan.likesSent": 1 },
            },
            { new: true }
          );
        } else if (
          user.plan.likesSent >= user.plan.likes &&
          user.plan.additionalLikes > 0
        ) {
          // Use additionalLikes if the plan's allowed likes are exhausted
          await User.findByIdAndUpdate(
            userID,
            {
              $push: { likedUsers: likeID },
              $inc: { "plan.additionalLikes": -1 },
            },
            { new: true }
          );
        }
        await User.findByIdAndUpdate(likeID, {
          $push: { usersLikedMe: userID },
        });
      }

      await trimUserRelations(userID);
      await trimUserRelations(likeID);

      // Return the updated user
      const updatedUser = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
        "likedUsers",
        "matchedUsers",
      ]);
      return { user: updatedUser, isMatch: isMutualLike, matchID: likeID };
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
