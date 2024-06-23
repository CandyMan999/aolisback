const { AuthenticationError, UserInputError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  addPhoneResolver: async (root, args, ctx) => {
    const { _id, phoneNumber } = args;
    try {
      // Check if the phone number is already in use
      const existingUser = await User.findOne({ phoneNumber });
      if (existingUser && existingUser._id !== _id) {
        throw new UserInputError("This phone number is already in use.");
      }

      // Check if the user is banned
      const userCheck = await User.findById(_id);
      if (userCheck.isBanned) {
        throw new AuthenticationError(
          `${userCheck.username}, has been banned for being a creepy fuck!`
        );
      }

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
