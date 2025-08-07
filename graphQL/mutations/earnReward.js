const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const {
  publishBuyLikes,
  publishBuyMessages,
  publishBuyMinutes,
} = require("../subscription/subscription");

module.exports = {
  earnRewardResolver: async (root, args, ctx) => {
    const { userId, rewardType } = args;
    let update = {};
    let publishFn = null;

    // Decide which field to increment and which pubsub event to publish
    switch (rewardType) {
      case "Minutes":
        update = { $inc: { "plan.additionalMinutes": 3 } };
        publishFn = publishBuyMinutes;
        break;
      case "Messages":
        update = { $inc: { "plan.additionalMessages": 2 } };
        publishFn = publishBuyMessages;
        break;
      case "Likes":
        update = { $inc: { "plan.additionalLikes": 5 } };
        publishFn = publishBuyLikes;
        break;
      default:
        throw new AuthenticationError("Invalid reward type");
    }

    try {
      const user = await User.findByIdAndUpdate(userId, update, { new: true });

      if (publishFn) publishFn(user);

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
