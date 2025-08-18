const { AuthenticationError, PubSub } = require("apollo-server");
const { User, Video } = require("../../models");
const {
  sendPushNotification,
  pushNotificationUserFlagged,
} = require("../../utils/middleware");
const { publishCreateVideo } = require("../subscription/subscription");
const axios = require("axios");

require("dotenv").config();

let processingQueue = [];
let isProcessing = false;

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID; // required
const CF_API_TOKEN = process.env.CF_STREAM_TOKEN;

module.exports = {
  directVideoUploadResolver: async (root, args, ctx) => {
    try {
      if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
        throw new Error(
          "Missing Cloudflare credentials (CF_ACCOUNT_ID / CF_STREAM_TOKEN or CF_API_TOKEN)"
        );
      }

      var body = {
        maxDurationSeconds: 60,
        allowedOrigins: ["gonechatting.com", "localhost:3000"],
        // creator: ctx && ctx.user ? ctx.user._id : null
      };

      var resp = await axios.post(
        "https://api.cloudflare.com/client/v4/accounts/" +
          CF_ACCOUNT_ID +
          "/stream/direct_upload",
        body,
        {
          headers: {
            Authorization: "Bearer " + CF_API_TOKEN,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      var data = resp && resp.data ? resp.data : null;
      var ok = data && data.success === true;
      var result = ok && data.result ? data.result : null;
      var uploadURL = result && result.uploadURL ? result.uploadURL : null;
      var uid = result && result.uid ? result.uid : null;

      if (!ok || !uploadURL || !uid) {
        throw new Error(
          "Cloudflare Stream direct upload failed: " + JSON.stringify(data)
        );
      }

      return { uploadURL: uploadURL, uid: uid, id: uid };
    } catch (err) {
      var payload =
        err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : err.message;
      throw new AuthenticationError(payload);
    }
  },

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

      // Add the video to the processing queue
      addToQueue(video._id, url);

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

// Function to add video processing to the queue
const addToQueue = (videoId, url) => {
  processingQueue.push({ videoId, url });
  if (!isProcessing) {
    processQueue();
  }
};

// Function to process the queue
const processQueue = async () => {
  if (processingQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const { videoId, url } = processingQueue.shift();

  await customNudityAPI(videoId, url);

  // Continue processing the next video in the queue
  processQueue();
};

const customNudityAPI = async (videoId, url) => {
  const apiUrl = true
    ? "https://auto-detect-1fcde9e6d000.herokuapp.com/nudity/detect"
    : process.env.NUDE_DETECTOR_URL;
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
