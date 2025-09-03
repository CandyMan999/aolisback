const { AuthenticationError } = require("apollo-server");
const { User, Like, Match } = require("../../models");
const { pushNotificationNewMatch } = require("../../utils/middleware");

module.exports = {
  likeResolver: async (root, args) => {
    const { userID, likeID } = args;

    try {
      const user = await User.findById(userID);
      if (!user) throw new Error("User not found");

      const already = await Like.findOne({ user: userID, target: likeID });
      if (already) {
        const populated = await User.findById(userID).populate(["pictures", "blockedUsers"]);
        return { user: populated, isMatch: false, matchID: likeID };
      }

      if (user.plan.likesSent < user.plan.likes) {
        await User.findByIdAndUpdate(userID, { $inc: { "plan.likesSent": 1 } });
      } else if (user.plan.additionalLikes > 0) {
        await User.findByIdAndUpdate(userID, { $inc: { "plan.additionalLikes": -1 } });
      } else {
        throw new AuthenticationError("No likes remaining");
      }

      await Like.create({ user: userID, target: likeID });

      const reciprocal = await Like.findOne({ user: likeID, target: userID });
      let isMatch = false;
      if (reciprocal) {
        isMatch = true;
        const users = [userID, likeID].sort();
        await Match.create({ users });
        const likedUser = await User.findById(likeID);
        pushNotificationNewMatch(user.username, likedUser.expoToken);
      }

      const populated = await User.findById(userID).populate([
        "pictures",
        "blockedUsers",
      ]);
      return { user: populated, isMatch, matchID: likeID };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },

  unLikeResolver: async (root, args) => {
    const { userID, unLikeID } = args;
    try {
      await Like.deleteOne({ user: userID, target: unLikeID });
      await Like.deleteOne({ user: unLikeID, target: userID });
      await Match.deleteOne({ users: { $all: [userID, unLikeID] } });

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
