const { AuthenticationError, PubSub } = require("apollo-server");
const { User, Video } = require("../../models");
const {
  sendPushNotification,
  pushNotificationUserFlagged,
} = require("../../utils/middleware");
const { publishCreateVideo } = require("../subscription/subscription");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  sendVideoResolver: async (root, args, ctx) => {
    const { url, publicId, receiverID, senderID } = args;

    try {
      // Create the video entry first
      const video = await Video.create({
        url,
        publicId,
        sender: senderID,
        receiver: receiverID,
        flagged: false, // Default to false, update later if nudity is detected
      });

      // Perform nudity detection in the background
      detectNudityInBackground(video._id, url);

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
        await User.findByIdAndUpdate(
          { _id: senderID },
          { $inc: { "plan.messagesSent": 1 } },
          { new: true }
        );
      } else if (
        user.plan.messagesSent >= user.plan.messages &&
        user.plan.additionalMessages > 0
      ) {
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

// Function to detect nudity asynchronously

const detectNudityInBackground = async (videoId, url) => {
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
    // Send POST request to detect nudity
    const response = await axios.request(options);
    console.log("response: ", response.data);

    if (response && response.data.nsfw >= 0.5) {
      // If nudity is detected, update the video entry
      await Video.findByIdAndUpdate(videoId, { flagged: true });

      console.log("firing:");
      pushNotificationUserFlagged("ExponentPushToken[PtoiwgLjWKaXTzEaTY0jbT]"); //Smokey
    }
    if (response && response.data.status === "error") {
      console.log("running backup");
      customNudityAPIBackup(videoId, url);
    }
  } catch (error) {
    console.error(
      "Error detecting nudity asynchronously with piece of shit api:",
      error
    );
  }
};

const customNudityAPIBackup = async (videoId, url) => {
  const apiUrl = process.env.NUDE_DETECTOR_URL;
  const videoData = {
    video_url: url,
  };

  try {
    // Send POST request to detect nudity
    const response = await axios.post(apiUrl, videoData);
    console.log("response: ", response.data);

    if (response && response.data.nudity_detected) {
      // If nudity is detected, update the video entry
      await Video.findByIdAndUpdate(videoId, { flagged: true });
      pushNotificationUserFlagged("ExponentPushToken[PtoiwgLjWKaXTzEaTY0jbT]");
    }
  } catch (error) {
    console.error("Error detecting nudity asynchronously:", error);
  }
};

// const analyzeVideo = async () => {
//   const options = {
//     method: "POST",
//     url: "https://nsfw-video-detector.p.rapidapi.com/nsfw",
//     headers: {
//       "x-rapidapi-key": process.env.RAPID_API_KEY,
//       "x-rapidapi-host": "nsfw-video-detector.p.rapidapi.com",
//       "Content-Type": "application/json",
//     },
//     data: {
//       url,
//       seek: 5,
//     },
//   };
//   try {
//     const response = await axios.request(options);
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Video analysis failed: ", error.message);
//     // Return null to indicate the analysis failed
//     return null;
//   }
// };

// const response = await analyzeVideo();
