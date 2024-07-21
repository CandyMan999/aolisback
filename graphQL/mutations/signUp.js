const { AuthenticationError } = require("apollo-server");
const { User, Plan } = require("../../models");

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
