const { AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const { User, Like, Match } = require("../../models");
const { pushNotificationNewMatch } = require("../../utils/middleware");

module.exports = {
  likeResolver: async (root, args) => {
    const { userID, likeID } = args;

    try {
      if (!likeID) throw new Error("Invalid target user");

      const targetId = new mongoose.Types.ObjectId(likeID);
      const likerId = new mongoose.Types.ObjectId(userID);

      const user = await User.findById(likerId);
      if (!user) throw new Error("User not found");

      const already = await Like.findOne({ user: likerId, target: targetId });
      if (already) {
        const populated = await User.findById(likerId).populate([
          "pictures",
          "blockedUsers",
        ]);
        return { user: populated, isMatch: false, matchID: likeID };
      }

      if (user.plan.likesSent < user.plan.likes) {
        await User.findByIdAndUpdate(likerId, { $inc: { "plan.likesSent": 1 } });
      } else if (user.plan.additionalLikes > 0) {
        await User.findByIdAndUpdate(likerId, {
          $inc: { "plan.additionalLikes": -1 },
        });
      } else {
        throw new AuthenticationError("No likes remaining");
      }

      await Like.create({ user: likerId, target: targetId });

      const reciprocal = await Like.findOne({
        user: targetId,
        target: likerId,
      });
      let isMatch = false;
      if (reciprocal) {
        isMatch = true;
        const users = [likerId, targetId].sort();
        await Match.create({ users });
        const likedUser = await User.findById(targetId);
        pushNotificationNewMatch(user.username, likedUser.expoToken);
      }

      const populated = await User.findById(likerId).populate([
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
      const targetId = new mongoose.Types.ObjectId(unLikeID);
      const likerId = new mongoose.Types.ObjectId(userID);

      await Like.deleteOne({ user: likerId, target: targetId });
      await Like.deleteOne({ user: targetId, target: likerId });
      await Match.deleteOne({ users: { $all: [likerId, targetId] } });

      const user = await User.findById(likerId).populate([
        "pictures",
        "blockedUsers",
      ]);
      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
