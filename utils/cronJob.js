const { User, Video } = require("../models");
const cron = require("node-cron");
const { pushNotificationProfile } = require("../utils/middleware");
const moment = require("moment");
const axios = require("axios"); // <-- add this
require("dotenv").config();

const BATCH_SIZE = 100;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_STREAM_TOKEN = process.env.CF_STREAM_TOKEN;

const resetVideoMinutesUsed = async () => {
  try {
    let totalUpdated = 0;
    let hasMoreUsers = true;
    let lastProcessedId = null;

    while (hasMoreUsers) {
      const query = lastProcessedId ? { _id: { $gt: lastProcessedId } } : {};
      const users = await User.find(query).limit(BATCH_SIZE).sort({ _id: 1 });

      if (users.length === 0) {
        hasMoreUsers = false;
        break;
      }

      const userIds = users.map((u) => u._id);
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { "plan.videoMinutesUsed": 0, inCall: false } }
      );

      totalUpdated += result.nModified;
      lastProcessedId = users[users.length - 1]._id;
    }

    console.log(`Reset videoMinutesUsed for ${totalUpdated} users.`);
  } catch (err) {
    console.error("Error resetting video minutes used:", err);
  }
};

const resetMessagesSent = async () => {
  try {
    let totalUpdated = 0;
    let hasMoreUsers = true;
    let lastProcessedId = null;

    while (hasMoreUsers) {
      const query = lastProcessedId ? { _id: { $gt: lastProcessedId } } : {};
      const users = await User.find(query).limit(BATCH_SIZE).sort({ _id: 1 });

      if (users.length === 0) {
        hasMoreUsers = false;
        break;
      }

      const userIds = users.map((u) => u._id);
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { "plan.messagesSent": 0, "plan.likesSent": 0, inCall: false } }
      );

      totalUpdated += result.nModified;
      lastProcessedId = users[users.length - 1]._id;
    }

    console.log(`Reset messages sent for ${totalUpdated} users.`);
  } catch (err) {
    console.error("Error resetting messages sent:", err);
  }
};

const deleteOldVideos = async () => {
  try {
    // Do the age filtering in Mongo, not in JS
    const twoDaysAgo = moment().subtract(3, "days").toDate();
    const sevenDaysAgo = moment().subtract(7, "days").toDate();

    const videos = await Video.find({
      $or: [
        // viewed AND older than 2 days AND not flagged
        {
          createdAt: { $lt: twoDaysAgo },
          viewed: true,
          flagged: { $ne: true },
        },
        // anything older than 7 days
        { createdAt: { $lt: sevenDaysAgo } },
      ],
    }).select("_id publicId receiver sender");

    console.log("videos: ", videos);

    if (!videos.length) return;

    // Clean up DB first
    await Promise.all(
      videos.map(async (video) => {
        const receiverId = video.receiver._id;
        const senderId = video.sender._id;

        await Video.deleteOne({ _id: video._id });

        await Promise.all([
          receiverId
            ? User.findByIdAndUpdate(receiverId, {
                $pull: { receivedVideos: video._id },
              })
            : null,
          senderId
            ? User.findByIdAndUpdate(senderId, {
                $pull: { sentVideos: video._id },
              })
            : null,
        ]);
      })
    );

    // Then delete the assets from Cloudflare Stream
    const uids = videos.map((v) => v.publicId).filter(Boolean);
    if (!uids.length) return;

    const results = await Promise.allSettled(
      uids.map((uid) =>
        axios.delete(
          `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
          {
            headers: { Authorization: `Bearer ${CF_STREAM_TOKEN}` },
            timeout: 20000,
          }
        )
      )
    );

    const failed = results
      .map((r, i) => ({ r, uid: uids[i] }))
      .filter((x) => x.r.status === "rejected");

    if (failed.length) {
      console.warn(
        "Some Cloudflare deletions failed:",
        failed.map((f) => ({
          uid: f.uid,
          reason:
            f.r.reason.response.data ||
            f.r.reason.message ||
            String(f.r.reason),
        }))
      );
    }
  } catch (err) {
    console.error("Error deleting old videos:", err);
  }
};

const cronJob = async () => {
  try {
    // be consistent: 6-field syntax (with seconds) for node-cron
    cron.schedule(
      "0 0 */6 * * *", // every 6 hours at hh:00:00
      async () => {
        const users = await User.find({ profileComplete: false });
        const allTokens = users.map((u) => u.expoToken).filter(Boolean);
        for (const pushToken of allTokens) {
          pushNotificationProfile(pushToken);
        }
        await deleteOldVideos();
      },
      { scheduled: true, timezone: "America/Denver" }
    );

    cron.schedule(
      "0 0 0 * * *", // daily at 00:00:00
      async () => {
        await resetMessagesSent();
      },
      { scheduled: true, timezone: "America/Denver" }
    );

    cron.schedule(
      "0 0 0 * * 0", // weekly (Sun) at 00:00:00
      async () => {
        await resetVideoMinutesUsed();
      },
      { scheduled: true, timezone: "America/Denver" }
    );
  } catch (err) {
    console.log("Error running cron:", err);
  }
};

module.exports = { cronJob };
