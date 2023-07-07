const { AuthenticationError } = require("apollo-server");
const { User, Video } = require("../../models");
const { publishCreateVideo } = require("../subscription/subscription");

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

      const receiver = await new User({
        username,
        password,
        email,
        isLoggedIn: true,
        roomInfo: { subscribedAt: moment() },
      }).save();

      const video = await Video.create({
        url: "https://res.cloudinary.com/localmassagepros/video/upload/v1686922266/GoneChatting.mp4",
        publicId: "wy3ybqezw97wiqtst5nm",
        sender: "64a5ed088d53300014ccf08a",
        receiver: receiver._id,
      });

      const user = await User.findByIdAndUpdate(
        { _id: receiver._id },
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

      const token = await createToken(user._id);
      return { user: user, token };
    } catch (err) {
      throw new AuthenticationError(err);
    }
  },
  appleSignupResolver: async (root, args, ctx) => {
    try {
      console.log("args apple: ", args);
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

      const receiver = await new User({
        username,
        name,
        email,
        appleId,
        isLoggedIn: true,
        roomInfo: { subscribedAt: moment() },
      }).save();

      const video = await Video.create({
        url: "https://res.cloudinary.com/localmassagepros/video/upload/v1686922266/GoneChatting.mp4",
        publicId: "wy3ybqezw97wiqtst5nm",
        sender: "64a5ed088d53300014ccf08a",
        receiver: receiver._id,
      });

      const user = await User.findByIdAndUpdate(
        { _id: receiver._id },
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

      const token = await createToken(user._id);
      return { user: user, token };
    } catch (err) {
      throw new AuthenticationError(err);
    }
  },
};
