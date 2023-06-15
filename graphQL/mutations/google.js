const { AuthenticationError, gql, PubSub } = require("apollo-server");
const { User, Picture, Video } = require("../../models");
const { OAuth2Client } = require("google-auth-library");
const { createToken } = require("../../utils/middleware");
const moment = require("moment");
const { publishCreateVideo } = require("../subscription/subscription");

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
      roomInfo: { subscribedAt: moment() },
    }).save();

    const newPhoto = await Picture.create({ url: picture, user: user._id });

    const video = await Video.create({
      url: "http://res.cloudinary.com/localmassagepros/video/upload/v1686791832/no3jierdzpkyftt4pnc1.mov",
      publicId: "no3jierdzpkyftt4pnc1",
      sender: "648131bb35e013ea02e8935d",
      receiver: user._id,
    });

    await User.findByIdAndUpdate(
      { _id: user._id },
      { $push: { receivedVideos: video } },
      { new: true }
    ).populate("receivedVideos");

    const newVideo = await Video.findOne({ _id: video._id }).populate([
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
    ]);

    publishCreateVideo(newVideo);

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
        { isLoggedIn: true, roomInfo: { subscribedAt: moment() } },
        { new: true }
      )
        .populate("pictures")
        .populate("comments");

      const token = await createToken(user._id);

      return !!user
        ? { user, token }
        : new AuthenticationError("Google User Dosen't Exist");
    } catch (err) {
      throw new AuthenticationError("Google User Dosen't Exist");
    }
  },
};
