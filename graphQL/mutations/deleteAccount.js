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
          const deletePhotoPromises = currentUser.pictures.map(async (pic) => {
            const { publicId } = await Picture.findById(pic._id);
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
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
          const deleteCommentPromises = currentUser.comments.map(
            async (comment) => {
              await Comment.deleteOne({ _id: comment._id });
            }
          );
          await Promise.all(deleteCommentPromises);

          // Remove references to the user's comments in any associated rooms
          const rooms = await Room.find({
            comments: { $in: currentUser.comments },
          });
          const updateRoomPromises = rooms.map(async (room) => {
            await Room.updateOne(
              { _id: room._id },
              { $pull: { comments: { $in: currentUser.comments } } }
            );
          });
          await Promise.all(updateRoomPromises);
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
            await cloudinary.api.delete_resources(publicIDs, {
              resource_type: "video",
            });
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

      const deleteUser = async () => {
        try {
          await User.deleteOne({ _id: currentUser._id });
        } catch (err) {
          throw new AuthenticationError(err.message);
        }
      };

      await deleteAllPhotos();
      await deleteAllComments();
      await deleteAllVideos();
      await removeUserReferences();
      await deleteUser();

      return { status: true };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
