const { AuthenticationError } = require("apollo-server");
const { User, Room } = require("../../models");

const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");

module.exports = {
  logoutResolver: async (root, args, ctx) => {
    const { username } = args;

    try {
      const user = await User.findOneAndUpdate(
        { username },
        { isLoggedIn: false },
        { new: true }
      );

      await Room.updateMany({ $pull: { users: user._id } });
      await User.updateOne(
        { _id: user._id },
        { $set: { comments: [], isLoggedIn: false } }
      );

      const getAllRooms = await Room.find({})
        .populate("users")
        .populate("kickVotes.target")
        .populate("kickVotes.voters");

      publishRoomCreatedOrUpdated(getAllRooms);

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
