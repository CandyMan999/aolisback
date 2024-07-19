const { User, Video } = require("../models");
const cron = require("node-cron");
const { pushNotificationProfile } = require("../utils/middleware");
const cloudinary = require("cloudinary").v2;
const moment = require("moment"); // Ensure you have moment.js installed
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cronJob = async () => {
  try {
    // Notification cron job
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

        // Video deletion job
        const videos = await Video.find();
        const videosNotFlagedandViewed = await Video.find({
          viewed: true,
          flagged: false,
        });
        const publicIDs = [];

        await Promise.all(
          videosNotFlagedandViewed.map(async (video) => {
            const pastDue = moment(video.createdAt).isBefore(
              moment().subtract(1, "days")
            );

            if (pastDue) {
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

        await Promise.all(
          videos.map(async (video) => {
            const pastDue = moment(video.createdAt).isBefore(
              moment().subtract(7, "days")
            );

            if (pastDue) {
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
          await cloudinary.api.delete_resources(
            publicIDs,

            { resource_type: "video" }
          );
        }
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
