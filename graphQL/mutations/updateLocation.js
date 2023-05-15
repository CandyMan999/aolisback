const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  updateLocationResolver: async (root, args, ctx) => {
    const { lat, lng, _id } = args;

    try {
      const user = await User.findByIdAndUpdate(
        { _id },
        { location: { lat, lng } },
        { new: true }
      ).populate("pictures");

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
