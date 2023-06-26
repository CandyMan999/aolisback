const { AuthenticationError, gql, PubSub } = require("apollo-server");
const { User, Picture, Video } = require("../../models");
const { OAuth2Client } = require("google-auth-library");
const { createToken, sendPushNotification } = require("../../utils/middleware");
const moment = require("moment");

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

    const { email, name, picture, sub } = await verifyAuthToken(idToken);

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
      googleId: sub,
      isLoggedIn: true,
      roomInfo: { subscribedAt: moment() },
    }).save();

    const newPhoto = await Picture.create({ url: picture, user: user._id });

    const video = await Video.create({
      url: "https://res.cloudinary.com/localmassagepros/video/upload/v1686922266/GoneChatting.mp4",
      publicId: "GoneChatting",
      sender: "648ba740bbb5cf00146ab4eb",
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

      const { email, sub } = await verifyAuthToken(idToken);

      const user = await User.findOneAndUpdate(
        { email },
        {
          isLoggedIn: true,
          googleId: sub,
          roomInfo: { subscribedAt: moment() },
        },
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
  googleAppLoginResolver: async (root, args, ctx) => {
    const { googleId } = args;
    try {
      const user = await User.findOneAndUpdate(
        { googleId },
        {
          isLoggedIn: true,

          roomInfo: { subscribedAt: moment() },
        },
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
  googleAppSignupResolver: async (root, args, ctx) => {
    const { username, email, name, picture, googleId } = args;
    console.log("args: ", args);

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
      googleId,
      isLoggedIn: true,
      roomInfo: { subscribedAt: moment() },
    }).save();

    const newPhoto = await Picture.create({ url: picture, user: user._id });

    const video = await Video.create({
      url: "https://res.cloudinary.com/localmassagepros/video/upload/v1686922266/GoneChatting.mp4",
      publicId: "GoneChatting",
      sender: "648ba740bbb5cf00146ab4eb",
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
};
