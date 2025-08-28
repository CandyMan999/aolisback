const { AuthenticationError } = require("apollo-server");
const { User, Picture, Room, Comment, Video } = require("../../models");
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
              if (video && video.publicId) {
                publicIDs.push(video.publicId);
              }
              await User.findByIdAndUpdate(
                { _id: video.receiver._id },
                { $pull: { receivedVideos: video._id } }
              );
              await Video.deleteOne({ _id: video._id });
            }
          );

          const deleteReceivedVideoPromises = currentUser.receivedVideos.map(
            async (videoId) => {
              const video = await Video.findById(videoId);
              if (video && video.publicId) {
                publicIDs.push(video.publicId);
              }
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
          // Update other users' matchedUsers, likedUsers, and usersLikedMe arrays
          await User.updateMany(
            { matchedUsers: currentUser._id },
            { $pull: { matchedUsers: currentUser._id } }
          );
          await User.updateMany(
            { likedUsers: currentUser._id },
            { $pull: { likedUsers: currentUser._id } }
          );
          await User.updateMany(
            { usersLikedMe: currentUser._id },
            { $pull: { usersLikedMe: currentUser._id } }
          );
          await User.updateMany(
            { blockedUsers: currentUser._id },
            { $pull: { blockedUsers: currentUser._id } }
          );
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      const removeUserFromRooms = async (userId) => {
        // Remove any kickVote entries where they were the target
        await Room.updateMany({}, { $pull: { kickVotes: { target: userId } } });

        // Remove them from voters arrays in remaining kickVotes
        await Room.updateMany(
          { "kickVotes.voters": userId },
          { $pull: { "kickVotes.$[].voters": userId } }
        );

        // Also ensure they're not lingering in users/bannedUsers lists
        await Room.updateMany({ users: userId }, { $pull: { users: userId } });
        await Room.updateMany(
          { bannedUsers: userId },
          { $pull: { bannedUsers: userId } }
        );
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

      return { status: true };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
