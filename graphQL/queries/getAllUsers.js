const { AuthenticationError } = require("apollo-server");
const { User, Room, Like } = require("../../models");
const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");
const moment = require("moment");

module.exports = {
  getAllUsersResolver: async (root, args, ctx) => {
    const { latitude, longitude, limit, skip } = args;
    const { ageRange, kids, sex } = ctx.currentUser.lookingFor;

    try {
      const likedIds = await Like.find({ user: ctx.currentUser._id }).distinct(
        "target"
      );

      const users = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 12500 * 1609.34,
          },
        },
        _id: { $nin: likedIds },
        profileComplete: true,
        age: {
          $gte: ageRange ? ageRange.lowEnd : 18,
          $lte: ageRange ? ageRange.highEnd : 80,
        },
        kids: kids === "Yes" ? { $exists: true } : kids,
        isBanned: false,
        $or: [
          { sex: sex },
          { sex: !sex || sex === "Gender_Diverse" ? { $exists: true } : null },
        ],
        "lookingFor.sex":
          !!ctx.currentUser.sex && ctx.currentUser.sex !== "Gender_Diverse"
            ? { $in: [ctx.currentUser.sex, "Gender_Diverse"] }
            : { $exists: true },
        "lookingFor.kids":
          ctx.currentUser.kids === "No" || !ctx.currentUser.kids
            ? { $exists: true }
            : ctx.currentUser.kids,
        "lookingFor.ageRange.lowEnd": {
          $lte: !!ctx.currentUser.age ? ctx.currentUser.age : 80,
        },
        "lookingFor.ageRange.highEnd": {
          $gte: !!ctx.currentUser.age ? ctx.currentUser.age : 18,
        },
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

      users.map(async (user) => {
        const isProbablyOffline = !user.roomInfo.subscribedAt
          ? true
          : moment(user.roomInfo.subscribedAt).isBefore(
              moment().subtract(30, "minutes")
            );

        if (isProbablyOffline) {
          await Room.updateMany({ $pull: { users: user._id } });
          await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { comments: [], isLoggedIn: false } },
            { new: true }
          );

          const getAllRooms = await Room.find({})
            .populate("users")
            .populate("kickVotes.target")
            .populate("kickVotes.voters")
            .populate("bannedUsers");

          publishRoomCreatedOrUpdated(getAllRooms);
        }
      });

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
