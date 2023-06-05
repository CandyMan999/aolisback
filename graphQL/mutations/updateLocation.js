const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  updateLocationResolver: async (root, args, ctx) => {
    const { latitude, longitude, _id } = args;

    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { "location.coordinates": [longitude, latitude] },
        { new: true }
      );

      return user.location;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
