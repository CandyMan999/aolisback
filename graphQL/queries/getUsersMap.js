const { AuthenticationError, gql } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getUsersMapResolver: async (root, args, ctx) => {
    const { latitude, longitude } = args;
    try {
      const users = await User.find({
        "location.coordinates": { $ne: [0, 0] },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // The order is [longitude, latitude]
            },
            $maxDistance: 12500 * 1609.34, // Convert miles to meters (1 mile = 1609.34 meters), we will use half of the distance of the largest possible circumfrence of the earth 12500 to return all users until we need a smaller API call
          },
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

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
