const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  addPhoneResolver: async (root, args, ctx) => {
    const { _id, phoneNumber } = args;
    try {
      const user = await User.findByIdAndUpdate(
        { _id },
        { phoneNumber },
        { new: true }
      ).populate("pictures");

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
