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
  deleteUserResolver: async (root, args, ctx) => {
    const { _id } = args;

    try {
      const currentUser = await User.findById(_id).populate([
        "pictures",
        "comments",
        "sentVideos",
        "blockedUsers",
        "receivedVideos",
      ]);

      if (!currentUser) {
        throw new AuthenticationError("User not found");
      }

      // -------------------------- Helpers --------------------------

      const deleteAllPhotos = async () => {
        try {
          if (!currentUser.pictures || currentUser.pictures.length === 0)
            return;

          const axios = require("axios");
          const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
          const CF_API_TOKEN = process.env.CF_API_TOKEN;

          const deletePhotoPromises = currentUser.pictures.map(async (pic) => {
            const picture = await Picture.findById(pic._id);
            if (!picture) return;

            if (picture.publicId) {
              try {
                if (picture.provider === "Cloudflare") {
                  // Cloudflare Images delete
                  await axios.delete(
                    "https://api.cloudflare.com/client/v4/accounts/" +
                      CF_ACCOUNT_ID +
                      "/images/v1/" +
                      picture.publicId,
                    { headers: { Authorization: "Bearer " + CF_API_TOKEN } }
                  );
                } else {
                  // Legacy Cloudinary
                  await cloudinary.uploader.destroy(picture.publicId);
                }
              } catch (extErr) {
                console.warn(
                  "Remote photo delete failed:",
                  (extErr && extErr.response) || (extErr && extErr.message)
                );
              }
            }

            await Picture.deleteOne({ _id: picture._id });
          });

          await Promise.all(deletePhotoPromises);
        } catch (err) {
          console.error("Error deleting photos:", err.message);
        }
      };

      const deleteAllComments = async () => {
        try {
          const userCommentIds = currentUser.comments || [];

          if (userCommentIds.length > 0) {
            // Delete the user's comments
            await Comment.deleteMany({ _id: { $in: userCommentIds } });

            // Remove references to the user's comments in rooms
            await Room.updateMany(
              { comments: { $in: userCommentIds } },
              { $pull: { comments: { $in: userCommentIds } } }
            );

            // Null out replyTo for comments that replied to the user's comments
            await Comment.updateMany(
              { replyTo: { $in: userCommentIds } },
              { $set: { replyTo: null } }
            );
          }
        } catch (err) {
          console.error("Error deleting comments:", err.message);
        }
      };

      // Cloudflare Stream UID is stored in Video.publicId
      const deleteAllVideos = async () => {
        try {
          const publicIDs = [];

          // SENT videos
          if (currentUser.sentVideos && currentUser.sentVideos.length > 0) {
            for (let i = 0; i < currentUser.sentVideos.length; i++) {
              const videoId = currentUser.sentVideos[i];
              const video = await Video.findById(videoId);
              if (!video) continue;

              if (video.publicId) publicIDs.push(video.publicId);

              // Remove pointer from receiver if present (receiver may be an ObjectId)
              if (video.receiver) {
                await User.findByIdAndUpdate(video.receiver, {
                  $pull: { receivedVideos: video._id },
                });
              }

              await Video.deleteOne({ _id: video._id });
            }
          }

          // RECEIVED videos
          if (
            currentUser.receivedVideos &&
            currentUser.receivedVideos.length > 0
          ) {
            for (let j = 0; j < currentUser.receivedVideos.length; j++) {
              const rId = currentUser.receivedVideos[j];
              const rVid = await Video.findById(rId);
              if (!rVid) continue;

              if (rVid.publicId) publicIDs.push(rVid.publicId);
              await Video.deleteOne({ _id: rVid._id });
            }
          }

          // Delete from Cloudflare Stream using collected publicIds (UIDs)
          if (publicIDs.length > 0) {
            const axios = require("axios");
            const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
            const CF_STREAM_TOKEN = process.env.CF_STREAM_TOKEN;

            const results = await Promise.allSettled(
              publicIDs.filter(Boolean).map((uid) =>
                axios.delete(
                  "https://api.cloudflare.com/client/v4/accounts/" +
                    CF_ACCOUNT_ID +
                    "/stream/" +
                    uid,
                  {
                    headers: { Authorization: "Bearer " + CF_STREAM_TOKEN },
                    timeout: 20000,
                  }
                )
              )
            );

            const failed = results.filter((r) => r.status === "rejected");
            if (failed.length) {
              console.warn(
                "Some Cloudflare Stream deletions failed:",
                failed.length
              );
            }
          }
        } catch (err) {
          console.error("Error deleting videos:", err.message);
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
          console.error("Error removing user references:", err.message);
        }
      };

      const removeUserFromRooms = async (userId) => {
        // 1) Remove any kickVote entries where they were the target
        await Room.updateMany({}, { $pull: { kickVotes: { target: userId } } });

        // 2) Remove them from any voters arrays
        await Room.updateMany(
          { "kickVotes.voters": userId },
          { $pull: { "kickVotes.$[].voters": userId } }
        );

        // 3) Ensure they're not lingering in users/bannedUsers lists
        await Room.updateMany({ users: userId }, { $pull: { users: userId } });
        await Room.updateMany(
          { bannedUsers: userId },
          { $pull: { bannedUsers: userId } }
        );
      };

      // Sanitize rooms for any unintentional nulls (legacy/malformed data)
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

        // Remove any null voters within nested arrays
        try {
          await Room.updateMany(
            {},
            { $pull: { "kickVotes.$[].voters": null } }
          );
        } catch (e) {
          // ignore if Mongo version lacks $[] support
        }

        // Optional: remove entries with empty voters arrays
        try {
          await Room.updateMany(
            { "kickVotes.voters": { $size: 0 } },
            { $pull: { kickVotes: { voters: { $size: 0 } } } }
          );
        } catch (e) {
          // ignore if not supported in your MongoDB version
        }
      };

      const deleteUser = async () => {
        try {
          await User.deleteOne({ _id: currentUser._id });
        } catch (err) {
          console.error("Error deleting user:", err.message);
        }
      };

      // ----------------------- Execution order -----------------------

      await deleteAllPhotos();
      await removeUserFromRooms(_id);
      await deleteAllComments();
      await deleteAllVideos();
      await removeUserReferences();
      await deleteUser();
      await sanitizeRooms();

      // Publish latest rooms so all clients update live
      const allRooms = await Room.find({})
        .populate("users")
        .populate("kickVotes.target")
        .populate("kickVotes.voters")
        .populate("bannedUsers");

      publishRoomCreatedOrUpdated(allRooms);

      return { status: true };
    } catch (err) {
      console.error("Error in deleteUserResolver:", err && err.message);
      throw new AuthenticationError(err.message);
    }
  },
};
