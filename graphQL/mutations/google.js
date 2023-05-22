const { AuthenticationError, gql, PubSub } = require("apollo-server");
const { User, Picture } = require("../../models");
const { OAuth2Client } = require("google-auth-library");
const { createToken } = require("../../utils/middleware");

require("dotenv").config();
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

module.exports = {
  googleSignupResolver: async (root, args, ctx) => {
    const { username, idToken } = args;

    const verifyAuthToken = async (idToken) => {
      try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: process.env.OAUTH_CLIENT_ID,
        });
        return ticket.getPayload();
      } catch (err) {
        console.error(`Error verifying auth token`, err);
      }
    };

    const { email, name, picture } = await verifyAuthToken(idToken);

    const checkIfUserExists = async (email, username) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new AuthenticationError("Google User Already Exists");
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
      name,
      email,
      username,
      isLoggedIn: true,
    }).save();

    const newPhoto = await Picture.create({ url: picture, user: user._id });

    const currentUser = await User.findByIdAndUpdate(
      {
        _id: user._id,
      },
      { $push: { pictures: newPhoto } },
      { new: true }
    ).populate("pictures");

    const token = await createToken(currentUser._id);

    return { user: currentUser, token };
  },
  googleLoginResolver: async (root, args, ctx) => {
    const { idToken } = args;
    try {
      const verifyAuthToken = async (idToken) => {
        try {
          const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.OAUTH_CLIENT_ID,
          });

          return ticket.getPayload();
        } catch (err) {
          console.error(`Error verifying auth token`, err);
        }
      };

      const { email } = await verifyAuthToken(idToken);
      const user = await User.findOneAndUpdate(
        { email },
        { isLoggedIn: true },
        { new: true }
      )
        .populate("pictures")
        .populate("comments");

      const token = await createToken(user._id);

      return !!user
        ? { user, token }
        : new AuthenticationError("Google User Dosen't Exist");
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};