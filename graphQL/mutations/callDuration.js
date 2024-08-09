const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  callDurationResolver: async (root, args, ctx) => {
    const { userID, time } = args;
    try {
      const userTime = await User.findById({ _id: userID });

      if (userTime.plan.videoMinutes > userTime.plan.videoMinutesUsed) {
        const user = await User.findByIdAndUpdate(
          { _id: userID },
          {
            $inc: { "plan.videoMinutesUsed": time },
            $set: { inCall: true },
          },
          { new: true }
        ).populate(["pictures", "blockedUsers"]);

        return { user, outOfTime: false };
      }

      // Check if videoMinutesUsed exceeds videoMinutes
      if (
        userTime.plan.videoMinutes <= userTime.plan.videoMinutesUsed &&
        userTime.plan.additionalMinutes > 0
      ) {
        // Decrement additionalMinutes if videoMinutes are exceeded
        const user = await User.findByIdAndUpdate(
          { _id: userID },
          {
            $inc: {
              "plan.additionalMinutes": -time,
            },
          },
          { new: true }
        ).populate(["pictures", "blockedUsers"]);

        // If additionalMinutes are depleted, return outOfTime
        if (user.plan.additionalMinutes <= 0) {
          return { user, outOfTime: true };
        } else {
          return { user, outOfTime: false };
        }
      }
      return { user: userTime, outOfTime: false };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
