const { AuthenticationError } = require("apollo-server");
const { User, Picture, Room, Comment, Video, Like, Match } = require("../../models");
const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
  deleteAccountResolver: async (root, args, ctx) => {
    const { currentUser } = ctx;

    try {
      const deleteAllPhotos = async () => {
        try {
          const axios = require("axios");
          const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
          const CF_API_TOKEN = process.env.CF_API_TOKEN;

          const deletePhotoPromises = currentUser.pictures.map(async (pic) => {
            const { publicId, provider } = await Picture.findById(pic._id);
            if (publicId) {
              try {
                if (provider === "Cloudflare") {
                  await axios.delete(
                    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${publicId}`,
                    { headers: { Authorization: `Bearer ${CF_API_TOKEN}` } }
                  );
                } else {
                  await cloudinary.uploader.destroy(publicId);
                }
              } catch (extErr) {
                console.warn(
                  "Remote photo delete failed:",
                  extErr.response || extErr.message
                );
              }
            }
            await Picture.deleteOne({ _id: pic._id });
          });

          await Promise.all(deletePhotoPromises);
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      const deleteAllComments = async () => {
        try {
          const userCommentIds = currentUser.comments;

          // Delete the user's comments
          await Comment.deleteMany({ _id: { $in: userCommentIds } });

          // Remove references to the user's comments in any associated rooms
          await Room.updateMany(
            { comments: { $in: userCommentIds } },
            { $pull: { comments: { $in: userCommentIds } } }
          );

          // Set replyTo to null for any comments that reply to the user's comments
          await Comment.updateMany(
            { replyTo: { $in: userCommentIds } },
            { $set: { replyTo: null } }
          );
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      const deleteAllVideos = async () => {
        try {
          const publicIDs = [];
          const deleteSentVideoPromises = currentUser.sentVideos.map(
            async (videoId) => {
              const video = await Video.findById(videoId);
              if (!video) return;
              if (video.publicId) publicIDs.push(video.publicId);
              if (video.receiver && video.receiver._id) {
                await User.findByIdAndUpdate(video.receiver._id, {
                  $pull: { receivedVideos: video._id },
                });
              }
              await Video.deleteOne({ _id: video._id });
            }
          );

          const deleteReceivedVideoPromises = currentUser.receivedVideos.map(
            async (videoId) => {
              const video = await Video.findById(videoId);
              if (!video) return;
              if (video.publicId) publicIDs.push(video.publicId);
              await Video.deleteOne({ _id: video._id });
            }
          );

          await Promise.all([
            ...deleteSentVideoPromises,
            ...deleteReceivedVideoPromises,
          ]);

          if (publicIDs.length) {
            const axios = require("axios");
            const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
            const CF_STREAM_TOKEN = process.env.CF_STREAM_TOKEN;

            const results = await Promise.allSettled(
              publicIDs.filter(Boolean).map((uid) =>
                axios.delete(
                  `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
                  {
                    headers: { Authorization: `Bearer ${CF_STREAM_TOKEN}` },
                    timeout: 20000,
                  }
                )
              )
            );

            const failed = results.filter((r) => r.status === "rejected");
            if (failed.length)
              console.warn(
                "Some Cloudflare Stream deletions failed:",
                failed.length
              );
          }
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      const removeUserReferences = async () => {
        try {
          await Like.deleteMany({
            $or: [{ user: currentUser._id }, { liked: currentUser._id }],
          });
          await Match.deleteMany({ users: currentUser._id });
          await User.updateMany(
            { blockedUsers: currentUser._id },
            { $pull: { blockedUsers: currentUser._id } }
          );
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      const removeUserFromRooms = async (userId) => {
        // 1) Remove any kickVotes where they were the target
        await Room.updateMany({}, { $pull: { kickVotes: { target: userId } } });

        // 2) Remove them from any voters arrays
        await Room.updateMany(
          { "kickVotes.voters": userId },
          { $pull: { "kickVotes.$[].voters": userId } }
        );

        // 3) Remove empty or malformed kickVotes entries in general
        //   - target missing/null
        await Room.updateMany(
          {},
          {
            $pull: {
              kickVotes: {
                $or: [{ target: { $exists: false } }, { target: null }],
              },
            },
          }
        );

        //   - voters exists but is empty (supported by MongoDB for $pull with $size)
        await Room.updateMany(
          { "kickVotes.voters": { $size: 0 } },
          { $pull: { kickVotes: { voters: { $size: 0 } } } }
        );

        // 4) Ensure they're not lingering in users/bannedUsers lists
        await Room.updateMany({ users: userId }, { $pull: { users: userId } });
        await Room.updateMany(
          { bannedUsers: userId },
          { $pull: { bannedUsers: userId } }
        );
      };
      const sanitizeRooms = async () => {
        // Remove entries with null/missing target
        await Room.updateMany(
          {},
          {
            $pull: {
              kickVotes: {
                $or: [{ target: { $exists: false } }, { target: null }],
              },
            },
          }
        );

        // Optional: remove entries with empty voters (skip if your MongoDB doesn’t allow $size in $pull)
        try {
          await Room.updateMany(
            { "kickVotes.voters": { $size: 0 } },
            { $pull: { kickVotes: { voters: { $size: 0 } } } }
          );
        } catch (e) {
          // ok to ignore if unsupported
        }
      };

      const deleteUser = async () => {
        try {
          await User.deleteOne({ _id: currentUser._id });
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      await deleteAllPhotos();
      await deleteAllComments();
      await removeUserFromRooms(currentUser._id);
      await deleteAllVideos();
      await removeUserReferences();
      await deleteUser();
      await sanitizeRooms();

      const allRooms = await Room.find({})
        .populate("users")
        .populate("kickVotes.target")
        .populate("kickVotes.voters")
        .populate("bannedUsers");

      publishRoomCreatedOrUpdated(allRooms);

      return { status: true };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
