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

      const deleteAllPhotos = async () => {
        try {
          if (!currentUser.pictures || currentUser.pictures.length === 0) {
            return;
          }

          const deletePhotoPromises = currentUser.pictures.map(async (pic) => {
            const picture = await Picture.findById(pic._id);
            if (picture && picture.publicId) {
              await cloudinary.uploader.destroy(picture.publicId);
              await Picture.deleteOne({ _id: picture._id });
            }
          });

          await Promise.all(deletePhotoPromises);
        } catch (err) {
          console.error("Error deleting photos:", err.message);
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
          console.error("Error deleting comments:", err.message);
        }
      };

      const deleteAllVideos = async () => {
        try {
          const publicIDs = [];

          if (currentUser.sentVideos && currentUser.sentVideos.length > 0) {
            const deleteSentVideoPromises = currentUser.sentVideos.map(
              async (videoId) => {
                const video = await Video.findById(videoId);
                if (video && video.publicId) {
                  publicIDs.push(video.publicId);
                }
                if (video && video.receiver) {
                  await User.findByIdAndUpdate(
                    { _id: video.receiver._id },
                    { $pull: { receivedVideos: video._id } }
                  );
                }
                await Video.deleteOne({ _id: video._id });
              }
            );

            await Promise.all(deleteSentVideoPromises);
          }

          if (
            currentUser.receivedVideos &&
            currentUser.receivedVideos.length > 0
          ) {
            const deleteReceivedVideoPromises = currentUser.receivedVideos.map(
              async (videoId) => {
                const video = await Video.findById(videoId);
                if (video && video.publicId) {
                  publicIDs.push(video.publicId);
                }
                await Video.deleteOne({ _id: video._id });
              }
            );

            await Promise.all(deleteReceivedVideoPromises);
          }

          if (publicIDs.length > 0) {
            await cloudinary.api.delete_resources(publicIDs, {
              resource_type: "video",
            });
          }
        } catch (err) {
          console.error("Error deleting videos:", err.message);
        }
      };

      const removeUserReferences = async () => {
        try {
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
          console.error("Error removing user references:", err.message);
        }
      };

      const deleteUser = async () => {
        try {
          await User.deleteOne({ _id: currentUser._id });
        } catch (err) {
          console.error("Error deleting user:", err.message);
        }
      };

      await deleteAllPhotos();
      await deleteAllComments();
      await deleteAllVideos();
      await removeUserReferences();
      await deleteUser();

      return { status: true };
    } catch (err) {
      console.error("Error in deleteUserResolver:", err.message);
      throw new AuthenticationError(err.message);
    }
  },
};
