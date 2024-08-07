const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
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
          // inCall: false,
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
      const notificationInterval = 4; // 4 hours

      for (const match of user.matchedUsers) {
        try {
          const myMatch = await User.findById(match);
          const beenLongerThan4 =
            !user.lastMatchNotification ||
            now.diff(moment(user.lastMatchNotification), "hours") >=
              notificationInterval;

          if (beenLongerThan4) {
            pushNotificationMatchOnline(user.username, myMatch.expoToken);

            // Update the user's lastMatchNotification
            const me = await User.findByIdAndUpdate(
              user._id,
              { lastMatchNotification: now.toDate() },
              { new: true }
            );
          }
        } catch (error) {
          console.error(`Error processing match ${match}:`, error);
        }
      }

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
