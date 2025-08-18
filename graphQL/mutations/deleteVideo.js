const { AuthenticationError } = require("apollo-server");
const { User, Video } = require("../../models");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_STREAM_TOKEN = process.env.CF_STREAM_TOKEN;

module.exports = {
  deleteVideoResolver: async (root, args, ctx) => {
    const { _id } = args;

    try {
      if (!CF_ACCOUNT_ID || !CF_STREAM_TOKEN) {
        throw new AuthenticationError(
          "Missing CF_ACCOUNT_ID or CF_STREAM_TOKEN"
        );
      }

      // All videos where this user is sender or receiver
      const videos = await Video.find({
        $or: [{ sender: _id }, { receiver: _id }],
      });

      for (const video of videos) {
        // keep only if older than 7 days
        const pastDue = moment(video.createdAt).isBefore(
          moment().subtract(7, "days")
        );
        if (!pastDue) continue;

        const uid = video.publicId; // publicId == Cloudflare Stream UID for your data
        if (uid) {
          try {
            await axios.delete(
              `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
              {
                headers: { Authorization: `Bearer ${CF_STREAM_TOKEN}` },
                timeout: 20000,
              }
            );
          } catch (e) {
            // Log and continue; we still clean up DB refs
            console.warn(
              `Cloudflare delete failed for uid ${uid}:`,
              (e && e.response && e.response.data) || e.message || e
            );
          }
        }

        // Remove the Video doc and pull references from both users
        const receiverId = video.reciever._id;

        const senderId = video.sender._id;

        await Video.deleteOne({ _id: video._id }).catch(() => {});

        if (receiverId) {
          await User.findByIdAndUpdate(
            receiverId,
            { $pull: { receivedVideos: video._id } },
            { new: true }
          ).catch(() => {});
        }

        if (senderId) {
          await User.findByIdAndUpdate(
            senderId,
            { $pull: { sentVideos: video._id } },
            { new: true }
          ).catch(() => {});
        }
      }

      // Return the updated list (same shape as before)
      const updatedVideos = await Video.find().populate([
        {
          path: "sender",
          model: "User",
          populate: { path: "pictures", model: "Picture" },
        },
        {
          path: "receiver",
          model: "User",
          populate: { path: "pictures", model: "Picture" },
        },
      ]);

      return updatedVideos;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
