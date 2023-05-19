const { AuthenticationError, gql } = require("apollo-server");
const { User, Room } = require("../../models");
const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");
const moment = require("moment");

module.exports = {
  getAllUsersResolver: async (root, args, ctx) => {
    try {
      const users = await User.find({}).populate([
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
