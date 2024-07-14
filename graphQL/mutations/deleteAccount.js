const { AuthenticationError } = require("apollo-server");
const { User, Picture, Room, Comment, Video } = require("../../models");
const cloudinary = require("cloudinary");
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
          currentUser.pictures.forEach(async (pic) => {
            const { publicId } = await Picture.findById(pic._id);
            if (publicId) {
              const deleteData = await cloudinary.uploader.destroy(publicId);
            }
            await Picture.deleteOne({ _id: pic._id });
          });
        } catch (err) {
          throw new AuthenticationError(err);
        }
      };

      const deleteAllComments = async () => {
        try {
          currentUser.comments.forEach(async (comment) => {
            await Comment.deleteOne({ _id: comment._id });
          });
        } catch (err) {
          throw new AuthenticationError(err);
        }
      };

      const deleteAllVideos = async () => {
        try {
          const publicIDs = [];
          currentUser.sentVideos.forEach(async (video) => {
            publicIDs.push(video.publicId);
            await User.findByIdAndUpdate(
              { _id: video.receiver._id },
              { $pull: { receivedVideos: video._id } }
            );
            const data = await Video.deleteOne({ _id: video._id });
          });
          currentUser.receivedVideos.forEach(async (video) => {
            publicIDs.push(video.publicId);
            const data = await Video.deleteOne({ _id: video._id });
          });
          const filterIDs = await publicIDs.filter(
            (id) => id !== "wy3ybqezw97wiqtst5nm"
          );
          if (!!filterIDs.length) {
            await cloudinary.api.delete_resources(filterIDs, {
              resource_type: "video",
            });
          }
        } catch (err) {
          throw new AuthenticationError(err);
        }
      };

      const deleteUser = async () => {
        try {
          await User.deleteOne({ _id: currentUser._id });
        } catch (err) {
          throw new AuthenticationError(err);
        }
      };

      await deleteAllPhotos();
      await deleteAllComments();
      await deleteAllVideos();
      await deleteUser();

      return { status: true };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
