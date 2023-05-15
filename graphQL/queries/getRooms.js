const { AuthenticationError, gql } = require("apollo-server");
const { User, Room } = require("../../models");
const moment = require("moment");

module.exports = {
  getRoomsResolver: async (root, args, ctx) => {
    try {
      let rooms = await Room.find({}).populate("users").populate("comments");

      await Promise.all(
        rooms.map(async (room) => {
          const isAfterMin = moment(room.createdAt).isBefore(
            moment().subtract(30, "minutes")
          );

          await Room.findByIdAndUpdate(
            {
              _id: room._id,
            },
            { comments: room.comments.length ? room.comments : [] },
            { new: true }
          );

          if (!room.users.length && !!isAfterMin && room.name !== "Main") {
            await room.deleteOne({ _id: room._id });
          }
          await room.users.map(async (user) => {
            const isAfterHour = moment(user.roomInfo.subscribedAt).isBefore(
              moment().subtract(2, "hours")
            );
            if (isAfterHour) {
              await Room.updateMany({ $pull: { users: user._id } });
              await User.updateOne(
                { _id: user._id },
                { $set: { comments: [], isLoggedIn: false } }
              );
            }
          });
        })
      );

      rooms = await Room.find({}).populate("users").populate("comments");

      return rooms;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
