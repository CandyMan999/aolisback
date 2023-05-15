const { AuthenticationError, gql } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  findUserResolver: async (root, args, ctx) => {
    const { _id } = args;
    try {
      const user = await User.findById({ _id }).populate("pictures");

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
