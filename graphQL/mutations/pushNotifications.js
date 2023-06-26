const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getExpoTokenResolver: async (root, args, ctx) => {
    const { userId, token } = args;

    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { expoToken: token },
        { new: true }
      )
        .populate("pictures")
        .populate("comments");

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
