const { AuthenticationError } = require("apollo-server");
const { Like } = require("../../models");

module.exports = {
  isLikedResolver: async (root, args) => {
    const { userID, otherID } = args;
    try {
      const exists = await Like.exists({
        user: userID,
        $or: [{ liked: otherID }, { target: otherID }],
      });
      return !!exists;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
