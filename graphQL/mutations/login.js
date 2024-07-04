const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");
const bcrypt = require("bcrypt");

const { createToken } = require("../../utils/middleware");
const moment = require("moment");

module.exports = {
  loginResolver: async (root, args, ctx) => {
    const { username, password } = args;

    try {
      const user = await User.findOneAndUpdate(
        { username },
        { isLoggedIn: true, roomInfo: { subscribedAt: moment() } },
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
      if (user.isBanned) {
        throw new AuthenticationError(
          `${user.username}, has been banned for being a creepy fuck!`
        );
      }
      if (user.appleId) {
        throw new AuthenticationError("Sign in with Apple for this account");
      }
      if (user.googleId) {
        throw new AuthenticationError("Sign in with Google for this account");
      }

      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = await createToken(user._id);

          return { user, token };
        } else {
          throw new AuthenticationError("Incorrect Password");
        }
      }
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  appleLoginResolver: async (root, args, ctx) => {
    const { appleId } = args;
    try {
      const user = await User.findOneAndUpdate(
        { appleId },
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

      if (user.isBanned) {
        throw new AuthenticationError(
          `${user.username}, has been banned for being a creepy fuck!`
        );
      }

      const token = await createToken(user._id);

      return !!user
        ? { user, token }
        : new AuthenticationError("Apple User Dosen't Exist");
    } catch (err) {
      throw new AuthenticationError("Apple User Dosen't Exist");
    }
  },
};
