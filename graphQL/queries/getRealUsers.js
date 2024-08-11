const { AuthenticationError, gql } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  getRealUsersResolver: async (root, args, ctx) => {
    try {
      const users = await User.find({ seeder: false }).populate("pictures");

      return users;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
