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

      // Set any constraints or metadata you like:
      var body = {
        maxDurationSeconds: 60,
        // IMPORTANT: no protocol in allowedOrigins
        allowedOrigins: ["gonechatting.com", "localhost:3000"],
        // requireSignedURLs: false, // optional, if you don't use signed playback
        // creator: ctx && ctx.user ? String(ctx.user._id) : undefined
      };

      // 1) Create a direct upload URL
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

      // 2) Fire-and-forget: ask Cloudflare to prepare MP4 downloads for this asset.
      //    This can be called immediately; Cloudflare will progress it as the video processes.
      (async function kickoffMp4() {
        try {
          await axios.post(
            "https://api.cloudflare.com/client/v4/accounts/" +
              CF_ACCOUNT_ID +
              "/stream/" +
              uid +
              "/downloads",
            {},
            {
              headers: {
                Authorization: "Bearer " + CF_API_TOKEN,
                "Content-Type": "application/json",
              },
              timeout: 15000,
            }
          );
        } catch (e) {
          // Do not fail the resolver if this background step errors.
          // You can log it for observability.
          console.warn(
            "[stream] downloads kickoff failed for uid " + uid + ":",
            e && e.response && e.response.data
              ? e.response.data
              : e && e.message
              ? e.message
              : e
          );
        }
      })();

      // Return the URL the client should POST the file to + the uid you’ll store
      return { uploadURL: uploadURL, uid: uid, id: uid };
    } catch (err) {
      var payload =
        err && err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : err && err.message
          ? err.message
          : String(err);
      throw new AuthenticationError(payload);
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

// const customNudityAPI = async (videoId, url) => {
//   const apiUrl = true
//     ? "https://auto-detect-1fcde9e6d000.herokuapp.com/nudity/detect"
//     : process.env.NUDE_DETECTOR_URL;
//   const videoData = {
//     video_url: url,
//   };

//   try {
//     // Send POST request to detect nudity
//     const response = await axios.post(apiUrl, videoData);
//     console.log("response: ", response.data);

//     if (response && response.data.nudity_detected) {
//       // If nudity is detected, update the video entry
//       await Video.findByIdAndUpdate(videoId, { flagged: true });
//       pushNotificationUserFlagged("ExponentPushToken[PtoiwgLjWKaXTzEaTY0jbT]");
//     }
//   } catch (error) {
//     console.error("Error detecting nudity asynchronously:", error);
//   }
// };

const customNudityAPI = async (videoId, urlOrUid) => {
  const apiUrl =
    process.env.NUDE_DETECTOR_URL ||
    "https://auto-detect-1fcde9e6d000.herokuapp.com/nudity/detect";

  // Use your existing env name exactly as provided
  const CF_STREAM_TOKEN = process.env.CF_STREAM_TOKEN || "";

  // Minimal helper (inline) to convert CF URLs/UID to MP4 download URL
  const toCfMp4 = (input) => {
    try {
      // If they passed a full URL
      const u = new URL(input);
      if (!/videodelivery\.net|cloudflarestream\.com/i.test(u.hostname))
        return input;

      // UID is first path segment
      const parts = u.pathname.split("/").filter(Boolean);
      const uid = parts[0];
      if (!uid) return input;

      // Rewrite to downloads MP4
      u.pathname = `/${uid}/downloads/default.mp4`;

      // Add token if you have one and it’s not already present
      if (CF_STREAM_TOKEN && !u.searchParams.has("token")) {
        u.searchParams.set("token", CF_STREAM_TOKEN);
      }
      return u.toString();
    } catch (e) {
      // If they passed just the UID, build a downloads URL
      if (/^[a-f0-9]{32}$/i.test(input)) {
        return `https://videodelivery.net/${input}/downloads/default.mp4${
          CF_STREAM_TOKEN ? `?token=${encodeURIComponent(CF_STREAM_TOKEN)}` : ""
        }`;
      }
      return input; // not CF, leave unchanged
    }
  };

  try {
    const src = toCfMp4(urlOrUid); // <-- only change
    // Optional: log without leaking token
    // console.log("[nudity] src:", src.replace(/token=[^&]+/, "token=*****"));

    const response = await axios.post(
      apiUrl,
      { video_url: src },
      { timeout: 60000 }
    );
    console.log("response: ", response.data);

    if (response && response.data.nudity_detected) {
      await Video.findByIdAndUpdate(videoId, { flagged: true });
      pushNotificationUserFlagged("ExponentPushToken[PtoiwgLjWKaXTzEaTY0jbT]");
    }
  } catch (error) {
    console.error(
      "Error detecting nudity asynchronously:",
      (error && error.response && error.response.data) || error.message
    );
  }
};
