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
        url: "http://res.cloudinary.com/localmassagepros/video/upload/v1686791832/no3jierdzpkyftt4pnc1.mov",
        publicId: "no3jierdzpkyftt4pnc1",
        sender: "648131bb35e013ea02e8935d",
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
