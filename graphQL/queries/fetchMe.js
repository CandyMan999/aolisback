const { AuthenticationError } = require("apollo-server");
const { User, Match } = require("../../models");
const { verifyToken } = require("../../utils/middleware");
const moment = require("moment");
const { pushNotificationMatchOnline } = require("../../utils/middleware");

module.exports = {
  fetchMeResolver: async (root, args, ctx) => {
    const { token } = args;

    try {
      const { id } = await verifyToken({ token });
      if (!id) {
        throw new AuthenticationError("Unauthenticated off token: ", token);
      }

      let user = await User.findOneAndUpdate(
        { _id: id },
        {
          isLoggedIn: true,
          roomInfo: { subscribedAt: moment() },
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

      if (!user) {
        return new AuthenticationError("Username Doesn't Exsist");
      }

      const now = moment();
      const notificationInterval = 4;

      const matches = await Match.find({ users: user._id }).populate("users");

      for (const match of matches) {
        try {
          const partner = match.users.find(
            (u) => u._id.toString() !== user._id.toString()
          );
          if (!partner) continue;
          const beenLongerThan4 =
            !user.lastMatchNotification ||
            now.diff(moment(user.lastMatchNotification), "hours") >=
              notificationInterval;

          if (beenLongerThan4) {
            pushNotificationMatchOnline(user.username, partner.expoToken);
            await User.findByIdAndUpdate(
              user._id,
              { lastMatchNotification: now.toDate() },
              { new: true }
            );
          }
        } catch (error) {
          console.error(`Error processing match ${match._id}:`, error);
        }
      }

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
