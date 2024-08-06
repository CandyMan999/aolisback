const { AuthenticationError } = require("apollo-server");
const { Video, Picture, User } = require("../../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
  unflagVideoResolver: async (root, { videoId }) => {
    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { flagged: false },
        { new: true }
      );
      return video;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  unflagPictureResolver: async (root, { pictureId }) => {
    try {
      const picture = await Picture.findByIdAndUpdate(
        pictureId,
        { flagged: false },
        { new: true }
      );
      return picture;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  banUserResolver: async (root, { userId }) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isBanned: true },
        { new: true }
      );

      const videos = await Video.find({ sender: userId });
      const pictures = await Picture.find({ user: userId });

      for (const video of videos) {
        await cloudinary.api.delete_resources([video.publicId], {
          resource_type: "video",
        });
        await Video.findByIdAndDelete(video._id);
      }

      for (const picture of pictures) {
        await cloudinary.api.delete_resources([picture.publicId], {
          resource_type: "image",
        });
        await Picture.findByIdAndDelete(picture._id);
      }

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
