const { AuthenticationError, PubSub } = require("apollo-server");
const { User, Video } = require("../../models");
const { sendPushNotification } = require("../../utils/middleware");

const { publishCreateVideo } = require("../subscription/subscription");

module.exports = {
  sendVideoResolver: async (root, args, ctx) => {
    const { url, publicId, receiverID, senderID } = args;

    try {
      const video = await Video.create({
        url,
        publicId,
        sender: senderID,
        receiver: receiverID,
      });

      const sender = await User.findByIdAndUpdate(
        { _id: senderID },
        { $push: { sentVideos: video } },
        { new: true }
      ).populate("sentVideos");

      const receiver = await User.findByIdAndUpdate(
        { _id: receiverID },
        { $push: { receivedVideos: video } },
        { new: true }
      ).populate("receivedVideos");

      // Increment the messagesSent field in the sender's plan
      const user = await User.findByIdAndUpdate(
        { _id: senderID },
        { $inc: { "plan.messagesSent": 1 } },
        { new: true }
      );

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

      if (receiver && receiver.expoToken) {
        sendPushNotification(receiver.expoToken, sender.username);
      }

      publishCreateVideo(newVideo);

      return newVideo;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
