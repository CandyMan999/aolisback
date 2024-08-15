const { AuthenticationError, gql } = require("apollo-server");
const { User, Room } = require("../../models");

module.exports = {
  getUsersMapResolver: async (root, args, ctx) => {
    const { latitude, longitude } = args;
    try {
      const users = await User.find({
        "location.coordinates": { $ne: [0, 0] },
        "location.showOnMap": true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // The order is [longitude, latitude]
            },
            $maxDistance: 12500 * 1609.34, // Convert miles to meters (1 mile = 1609.34 meters), we will use half of the distance of the largest possible circumfrence of the earth 12500 to return all users until we need a smaller API call
          },
        },
        isBanned: false,
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
        }
      });

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
