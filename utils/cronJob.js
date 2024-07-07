const { User, Video } = require("../models");
const cron = require("node-cron");
const { pushNotificationProfile } = require("../utils/middleware");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

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
          ],
        });

        const allTokens = users.map((user) => user.expoToken);

        for (let pushToken of allTokens) {
          if (pushToken) {
            pushNotificationProfile(pushToken);
          }
        }
      },
      { scheduled: true, timezone: "America/Denver" }
    );

    cron.schedule(
      "0 0 */10 * *", // Every 10 days at midnight
      async () => {
        const allUsers = await User.find();

        for (const user of allUsers) {
          await deleteAllVideos(user);
        }
      },
      { scheduled: true, timezone: "America/Denver" }
    );

    const deleteAllVideos = async (currentUser) => {
      try {
        const publicIDs = [];
        for (const video of currentUser.sentVideos) {
          publicIDs.push(video.publicId);
          await User.findByIdAndUpdate(
            { _id: video.receiver._id },
            { $pull: { receivedVideos: video._id } }
          );
          await Video.deleteOne({ _id: video._id });
        }
        for (const video of currentUser.receivedVideos) {
          publicIDs.push(video.publicId);
          await Video.deleteOne({ _id: video._id });
        }

        if (publicIDs.length) {
          await cloudinary.api.delete_resources(publicIDs, {
            resource_type: "video",
          });
        }

        // Clear references in the user object
        await User.findByIdAndUpdate(currentUser._id, {
          $set: {
            sentVideos: [],
            receivedVideos: [],
          },
        });
      } catch (err) {
        console.log("Error deleting videos:", err);
      }
    };
  } catch (err) {
    console.log("Error running cron:", err);
  }
};

module.exports = {
  cronJob,
};
