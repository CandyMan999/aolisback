const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const {
  publishBuyLikes,
  publishBuyMessages,
  publishBuyMinutes,
} = require("../subscription/subscription");

module.exports = {
  buyVideoMinutesResolver: async (root, args, ctx) => {
    const { _id, numberMinutes } = args;
    try {
      const user = await User.findByIdAndUpdate(
        { _id },
        { $inc: { "plan.additionalMinutes": numberMinutes } },

        { new: true }
      );

      publishBuyMinutes(user);
      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  buyMessagesResolver: async (root, args, ctx) => {
    const { _id, numberMessages } = args;

    try {
      const user = await User.findByIdAndUpdate(
        { _id },
        { $inc: { "plan.additionalMessages": numberMessages } },
        { new: true }
      );
      publishBuyMessages(user);
      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  buyLikesResolver: async (root, args, ctx) => {
    const { _id, numberLikes } = args;
    try {
      const user = await User.findByIdAndUpdate(
        { _id },
        { $inc: { "plan.additionalLikes": numberLikes } },
        { new: true }
      );
      publishBuyLikes(user);
      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
