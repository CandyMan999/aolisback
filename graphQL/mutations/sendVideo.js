const { AuthenticationError, PubSub } = require("apollo-server");
const { User, Video } = require("../../models");
const { sendPushNotification } = require("../../utils/middleware");
const { publishCreateVideo } = require("../subscription/subscription");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  sendVideoResolver: async (root, args, ctx) => {
    const { url, publicId, receiverID, senderID } = args;

    try {
      const analyzeVideo = async () => {
        const options = {
          method: "POST",
          url: "https://nsfw-video-detector.p.rapidapi.com/nsfw",
          headers: {
            "x-rapidapi-key": process.env.RAPID_API_KEY,
            "x-rapidapi-host": "nsfw-video-detector.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          data: {
            url,
            seek: 10,
          },
        };
        try {
          console.log("url sent: ", options.url);

          const response = await axios.request(options);
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.error("Video analysis failed: ", error.message);
          // Return null to indicate the analysis failed
          return null;
        }
      };

      const response = await analyzeVideo();

      let isExplicit = false;

      if (response) {
        // Determine if the video should be flagged
        isExplicit = response.nsfw > 0.75;
      } else {
        console.log("Proceeding without flagging since analysis failed.");
      }

      console.log("isExplicit? ", isExplicit);

      // Create the video entry
      const video = await Video.create({
        url,
        publicId,
        sender: senderID,
        receiver: receiverID,
        flagged: isExplicit,
      });

      // Update the sender and receiver with the new video
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

      // Handle message allowance
      const user = await User.findById(senderID);

      if (user.plan.messagesSent < user.plan.messages) {
        // If within the regular message limit, increment messagesSent
        await User.findByIdAndUpdate(
          { _id: senderID },
          { $inc: { "plan.messagesSent": 1 } },
          { new: true }
        );
      } else if (
        user.plan.messagesSent >= user.plan.messages &&
        user.plan.additionalMessages > 0
      ) {
        // If the regular message limit is exceeded, decrement additionalMessages
        await User.findByIdAndUpdate(
          { _id: senderID },
          { $inc: { "plan.additionalMessages": -1 } },
          { new: true }
        );
      }

      // Populate the new video with sender and receiver details
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

      // Send a push notification to the receiver
      if (receiver && receiver.expoToken) {
        sendPushNotification(receiver.expoToken, sender.username);
      }

      // Publish the new video for subscriptions
      publishCreateVideo(newVideo);

      return newVideo;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
