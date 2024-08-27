const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const { publishChangePlan } = require("../subscription/subscription");

module.exports = {
  changePlanResolver: async (root, args, ctx) => {
    const { _id, planType } = args;

    try {
      const getPlanBenefits = (planType) => {
        switch (planType) {
          case "Free":
            return { messages: 3, videoMinutes: 15 * 60, likes: 20 };
          case "Premium":
            return { messages: 6, videoMinutes: 30 * 60, likes: 30 };
          case "Unlimited":
            return { messages: 1000, videoMinutes: 10000 * 60, likes: 1000 };
          default:
            return { messages: 0, videoMinutes: 0, likes: 0 }; // Default case if planType doesn't match any known type
        }
      };

      const planBenefits = getPlanBenefits(planType);

      const userFound = await User.findById(_id);

      if (!userFound) {
        throw new AuthenticationError("User not found");
      }

      // Manually merge the plan objects
      const updatedPlan = Object.assign({}, userFound.plan, {
        planType,
        messages: planBenefits.messages,
        videoMinutes: planBenefits.videoMinutes,
        likes: planBenefits.likes,
      });

      const user = await User.findByIdAndUpdate(
        { _id },
        {
          plan: updatedPlan,
        },
        { new: true }
      ).populate([
        "pictures",
        "comments",
        "sentVideos",
        "blockedUsers",
        "receivedVideos",
        {
          path: "sentVideos",
          populate: [
            {
              path: "sender",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
            {
              path: "receiver",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
          ],
        },
        {
          path: "receivedVideos",
          populate: [
            "blockedUsers",
            {
              path: "sender",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
            {
              path: "receiver",
              model: "User",
              populate: {
                path: "pictures",
                model: "Picture",
              },
            },
          ],
        },
      ]);

      publishChangePlan(user);

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
