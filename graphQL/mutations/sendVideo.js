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
            seek: 5,
          },
        };
        try {
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

// Step 1: Submit the video for analysis
// const analyzeVideo = async () => {
//   const options = {
//     method: "POST",
//     url: "https://video-moderation-api-for-nudity-detection.p.rapidapi.com/v1/video/find-explicit-content",
//     headers: {
//       "x-rapidapi-key": process.env.RAPID_API_KEY,
//       "x-rapidapi-host":
//         "video-moderation-api-for-nudity-detection.p.rapidapi.com",
//       "Content-Type": "application/json",
//     },
//     data: {
//       type: "url",
//       url: url,
//     },
//   };
//   try {
//     const response = await axios.request(options);
//     console.log("Analysis response: ", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Video analysis failed: ", error.message);
//     return null;
//   }
// };

// // Step 2: Call the analysis function
// const analysisResponse = await analyzeVideo();
// if (!analysisResponse || !analysisResponse.PublicId) {
//   console.log("Proceeding without flagging since analysis failed.");
//   throw new Error("Failed to analyze video.");
// }

// const publicId = analysisResponse.PublicId;

// // Step 3: Polling function to check the result until it's ready or timeout occurs
// const pollResults = async (publicId, threshold = 0.7) => {
//   const options = {
//     method: "GET",
//     url: "https://video-moderation-api-for-nudity-detection.p.rapidapi.com/v1/video/get-result-by-id",
//     headers: {
//       "x-rapidapi-key": process.env.RAPID_API_KEY,
//       "x-rapidapi-host":
//         "video-moderation-api-for-nudity-detection.p.rapidapi.com",
//     },
//     params: {
//       publicId: publicId,
//       threshold: threshold,
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     console.log("Moderation result: ", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to get moderation results: ", error.message);
//     return null;
//   }
// };

// const waitForResults = async () => {
//   const maxTime = 30000; // 30 seconds
//   const pollInterval = 1000; // 1 second
//   const startTime = Date.now();

//   // Initial delay of 3 seconds
//   await new Promise((resolve) => setTimeout(resolve, 3000));

//   let moderationResults = await pollResults(publicId);

//   // Keep polling every second until results are not null or timeout is reached
//   while (
//     (!moderationResults ||
//       moderationResults.ContainsInAppropriateNudityContentInVideo ===
//         null) &&
//     Date.now() - startTime < maxTime
//   ) {
//     await new Promise((resolve) => setTimeout(resolve, pollInterval));
//     moderationResults = await pollResults(publicId);
//   }

//   // If the timeout is reached and results are still null, proceed with isExplicit as false
//   if (
//     !moderationResults ||
//     moderationResults.ContainsInAppropriateNudityContentInVideo === null
//   ) {
//     console.log(
//       "Timeout reached without results. Proceeding with isExplicit set to false."
//     );
//     return { isExplicit: false };
//   }

//   return moderationResults;
// };

// const moderationResults = await waitForResults();
// let isExplicit = false;

// // Step 4: Use `some()` to determine if any time segment contains explicit content
// if (moderationResults && moderationResults.Results) {
//   isExplicit = moderationResults.Results.some(
//     (result) => result.ContainsInAppropriateNudityContent
//   );
// }
