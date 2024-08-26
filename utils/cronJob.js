const { User, Video } = require("../models");
const cron = require("node-cron");
const { pushNotificationProfile } = require("../utils/middleware");
const cloudinary = require("cloudinary").v2;
const moment = require("moment"); // Ensure you have moment.js installed
require("dotenv").config();
const BATCH_SIZE = 100;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const resetVideoMinutesUsed = async () => {
  try {
    let totalUpdated = 0;
    let hasMoreUsers = true;
    let lastProcessedId = null; // Use this for efficient pagination

    while (hasMoreUsers) {
      const query = lastProcessedId ? { _id: { $gt: lastProcessedId } } : {};
      const users = await User.find(query).limit(BATCH_SIZE).sort({ _id: 1 });

      if (users.length === 0) {
        hasMoreUsers = false;
        break;
      }

      const userIds = users.map((user) => user._id);
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { "plan.videoMinutesUsed": 0, inCall: false } }
      );

      totalUpdated += result.nModified;
      console.log(`Batch updated. Total users updated so far: ${totalUpdated}`);

      // Set last processed user ID for the next iteration
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
    let lastProcessedId = null; // Use this for efficient pagination

    while (hasMoreUsers) {
      const query = lastProcessedId ? { _id: { $gt: lastProcessedId } } : {};
      const users = await User.find(query).limit(BATCH_SIZE).sort({ _id: 1 });

      if (users.length === 0) {
        hasMoreUsers = false;
        break;
      }

      const userIds = users.map((user) => user._id);
      const result = await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { "plan.messagesSent": 0, "plan.likesSent": 0, inCall: false } }
      );

      totalUpdated += result.nModified;
      console.log(`Batch updated. Total users updated so far: ${totalUpdated}`);

      // Set last processed user ID for the next iteration
      lastProcessedId = users[users.length - 1]._id;
    }

    console.log(`Reset messages sent for ${totalUpdated} users.`);
  } catch (err) {
    console.error("Error resetting messages sent:", err);
  }
};

const deleteOldVideos = async () => {
  try {
    const videos = await Video.find();
    const publicIDs = [];

    await Promise.all(
      videos.map(async (video) => {
        const viewedAndOld =
          moment(video.createdAt).isBefore(moment().subtract(2, "days")) &&
          video.viewed &&
          !video.flagged;

        const old = moment(video.createdAt).isBefore(
          moment().subtract(7, "days")
        );

        if (viewedAndOld || old) {
          publicIDs.push(video.publicId);
          const receiver = video.receiver._id;
          const sender = video.sender._id;

          await Video.deleteOne({ _id: video._id });

          await User.findByIdAndUpdate(
            receiver,
            { $pull: { receivedVideos: video._id } },
            { new: true }
          );

          await User.findByIdAndUpdate(
            sender,
            { $pull: { sentVideos: video._id } },
            { new: true }
          );
        }
      })
    );

    if (publicIDs.length) {
      await cloudinary.api.delete_resources(publicIDs, {
        resource_type: "video",
      });
    }
  } catch (err) {
    console.error("Error deleting old videos:", err);
  }
};

const cronJob = async () => {
  try {
    cron.schedule(
      "0 0 */2 * * *",
      async () => {
        const users = await User.find({
          $or: [
            { intro: { $exists: false } },
            { sex: { $exists: false } },
            { occupation: { $exists: false } },
            { drink: { $exists: false } },
            { marijuana: { $exists: false } },
            { kids: { $exists: false } },
            { drugs: { $exists: false } },
            { pictures: { $exists: true, $size: 0 } },
          ],
        });

        const allTokens = users.map((user) => user.expoToken);

        for (let pushToken of allTokens) {
          if (pushToken) {
            pushNotificationProfile(pushToken);
          }
        }

        await deleteOldVideos();
      },
      { scheduled: true, timezone: "America/Denver" }
    );

    cron.schedule(
      "0 0 * * *",
      async () => {
        await resetMessagesSent();
      },
      { scheduled: true, timezone: "America/Denver" }
    );

    cron.schedule(
      "0 0 * * 0",
      async () => {
        await resetVideoMinutesUsed();
      },
      { scheduled: true, timezone: "America/Denver" }
    );
  } catch (err) {
    console.log("Error running cron:", err);
  }
};

module.exports = {
  cronJob,
};
