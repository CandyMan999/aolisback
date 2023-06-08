const { AuthenticationError, gql } = require("apollo-server");
const { User, Room } = require("../../models");
const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");
const moment = require("moment");

module.exports = {
  getAllUsersResolver: async (root, args, ctx) => {
    const { latitude, longitude } = args;
    const { ageRange, kids, sex } = ctx.currentUser.lookingFor;

    try {
      const users = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // The order is [longitude, latitude]
            },
            $maxDistance: 12500 * 1609.34, // Convert miles to meters (1 mile = 1609.34 meters), we will use half of the distance of the largest possible circumfrence of the earth 12500 to return all users until we need a smaller API call
          },
        },
        age: {
          $gte: ageRange.lowEnd,
          $lte: ageRange.highEnd,
        },
        kids: kids === "" ? { $exists: true } : kids,
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
        .limit(200)
        .populate([
          "room",
          "blockedUsers",
          "pictures",
          "sentVideos",
          "receivedVideos",
        ]);

      users.map(async (user) => {
        const isAfterHour = !user.roomInfo.subscribedAt
          ? true
          : moment(user.roomInfo.subscribedAt).isBefore(
              moment().subtract(2, "hours")
            );

        if (isAfterHour) {
          await Room.updateMany({ $pull: { users: user._id } });
          await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { comments: [], isLoggedIn: false } },
            { new: true }
          );

          const getAllRooms = await Room.find({}).populate("users");
          publishRoomCreatedOrUpdated(getAllRooms);
        }
      });

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
