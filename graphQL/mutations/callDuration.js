const { AuthenticationError } = require("apollo-server");
const { User, Plan } = require("../../models");

module.exports = {
  callDurationResolver: async (root, args, ctx) => {
    const { userID, time } = args;
    try {
      const user = await User.findByIdAndUpdate(
        { _id: userID },
        {
          $inc: { "plan.videoMinutesUsed": time },
          $set: { inCall: true },
        },
        { new: true }
      ).populate(["pictures", "blockedUsers"]);

      if (user.plan.videoMinutes < user.plan.videoMinutesUsed) {
        return { user, outOfTime: true };
      }

      return { user, outOfTime: false };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
