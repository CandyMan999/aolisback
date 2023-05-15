const { AuthenticationError } = require("apollo-server");
const { User } = require("../../models");

const { createToken } = require("../../utils/middleware");

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
      }).save();

      const token = await createToken(user._id);
      return { user: user, token };
    } catch (err) {
      throw new AuthenticationError(err);
    }
  },
};
