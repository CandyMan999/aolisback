const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  blockResolver: async (root, args, ctx) => {
    const { userID, blockID } = args;
    try {
      const user = await User.findByIdAndUpdate(
        { _id: userID },
        { $push: { blockedUsers: blockID } },
        { new: true }
      ).populate(["pictures", "blockedUsers"]);

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  unBlockResolver: async (root, args, ctx) => {
    const { userID, blockID } = args;
    try {
      const user = await User.findByIdAndUpdate(
        { _id: userID },
        { $pull: { blockedUsers: blockID } },
        { new: true }
      ).populate(["pictures", "blockedUsers"]);

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
