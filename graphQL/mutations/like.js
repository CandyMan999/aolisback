const { AuthenticationError } = require("apollo-server");
const { User, Like, Match } = require("../../models");
const { pushNotificationNewMatch } = require("../../utils/middleware");

module.exports = {
  likeResolver: async (root, args, ctx) => {
    const { userID, likeID } = args;
    try {
      const user = await User.findById(userID);
      if (user.plan.likesSent < user.plan.likes) {
        await User.findByIdAndUpdate(userID, {
          $inc: { "plan.likesSent": 1 },
        });
      } else if (
        user.plan.likesSent >= user.plan.likes &&
        user.plan.additionalLikes > 0
      ) {
        await User.findByIdAndUpdate(userID, {
          $inc: { "plan.additionalLikes": -1 },
        });
      } else {
        const updatedUser = await User.findById(userID).populate([
          "pictures",
          "blockedUsers",
        ]);
        return { user: updatedUser, isMatch: false, matchID: null };
      }

      await Like.findOneAndUpdate(
        { user: userID, target: likeID },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const reciprocal = await Like.findOne({ user: likeID, target: userID });
      let isMatch = false;
      if (reciprocal) {
        const pair = [userID, likeID].sort();
        await Match.findOneAndUpdate(
          { users: pair },
          { users: pair },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const likedUser = await User.findById(likeID);
        const refreshedUser = await User.findById(userID);
        pushNotificationNewMatch(refreshedUser.username, likedUser.expoToken);
        isMatch = true;
      }

      const updatedUser = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
      ]);

      return { user: updatedUser, isMatch, matchID: isMatch ? likeID : null };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },

  unLikeResolver: async (root, args, ctx) => {
    const { userID, unLikeID } = args;
    try {
      await Like.findOneAndDelete({ user: userID, target: unLikeID });
      const pair = [userID, unLikeID].sort();
      await Match.findOneAndDelete({ users: pair });

      const user = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
      ]);
      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
