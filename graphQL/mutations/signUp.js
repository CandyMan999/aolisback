const { AuthenticationError } = require("apollo-server");
const { User, Plan } = require("../../models");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const { createToken } = require("../../utils/middleware");
moment = require("moment");

module.exports = {
  signupResolver: async (root, args, ctx) => {
    try {
      const { username, password, email } = args;

      const checkIfUserExists = async (email, username) => {
        const user = await User.findOne({ email });
        if (user) {
          throw new AuthenticationError("Email Already Exists");
        } else {
          const user = await User.findOne({ username });
          if (user) {
            throw new AuthenticationError("Username Already Exists");
          }
        }
      };

      const validate = await checkIfUserExists(email, username);
      if (validate) {
        return;
      }

      const user = await new User({
        username,
        password,
        email,
        isLoggedIn: true,
        roomInfo: { subscribedAt: moment() },
      }).save();

      const token = await createToken(user._id);
      return { user, token };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  resetPasswordResolver: async (root, args, ctx) => {
    try {
      const { username, password } = args;

      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("Username Not Found");
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);

      const updatedUser = await User.findOneAndUpdate(
        {
          username,
        },
        {
          password: hashedPassword,
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

      const token = createToken(updatedUser._id);

      return { user: updatedUser, token };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  appleSignupResolver: async (root, args, ctx) => {
    try {
      const { email, name, appleId, username } = args;

      const checkIfUserExists = async (email, username, appleId) => {
        if (email) {
          const user = await User.findOne({ email });
          if (user) {
            throw new AuthenticationError("Email Already Exists");
          }
        }
        const userUsername = await User.findOne({ username });
        if (userUsername) {
          throw new AuthenticationError("Username Already Exists");
        }
        const userApple = await User.findOne({ appleId });
        if (userApple) {
          throw new AuthenticationError(
            "User with this AppleId Already Exists"
          );
        }
      };

      const validate = await checkIfUserExists(email, username, appleId);
      if (validate) {
        return;
      }

      const user = await new User({
        username,
        name,
        email,
        appleId,
        isLoggedIn: true,
        roomInfo: { subscribedAt: moment() },
      }).save();

      const token = await createToken(user._id);
      return { user, token };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
