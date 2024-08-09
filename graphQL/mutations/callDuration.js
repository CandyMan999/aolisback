const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

module.exports = {
  callDurationResolver: async (root, args, ctx) => {
    const { userID, time } = args;
    try {
      const userTime = await User.findById({ _id: userID });

      // Check if the user still has videoMinutes available
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

      // Check if videoMinutes are exhausted and additionalMinutes are available
      if (
        userTime.plan.videoMinutes <= userTime.plan.videoMinutesUsed &&
        userTime.plan.additionalMinutes > 0
      ) {
        const user = await User.findByIdAndUpdate(
          { _id: userID },
          {
            $inc: {
              "plan.additionalMinutes": -time,
            },
          },
          { new: true }
        ).populate(["pictures", "blockedUsers"]);

        // If additionalMinutes are depleted after decrementing
        if (user.plan.additionalMinutes <= 0) {
          return { user, outOfTime: true };
        } else {
          return { user, outOfTime: false };
        }
      }

      // If both videoMinutes and additionalMinutes are exhausted
      if (
        userTime.plan.videoMinutes <= userTime.plan.videoMinutesUsed &&
        userTime.plan.additionalMinutes <= 0
      ) {
        return { user: userTime, outOfTime: true };
      }

      return { user: userTime, outOfTime: false }; // Default return if no conditions are met
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
