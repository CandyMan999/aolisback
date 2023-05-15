const { AuthenticationError } = require("apollo-server");
const { User, Picture } = require("../../models");
const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
  deletePhotoResolver: async (root, args, ctx) => {
    const { photoId, userId } = args;

    try {
      const { publicId } = await Picture.findById(photoId);

      if (publicId) {
        const deleteData = await cloudinary.uploader.destroy(publicId);
      }

      await Picture.deleteOne({ _id: photoId });
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { pictures: photoId } },
        { new: true }
      )
        .populate("pictures")
        .populate("comments");
      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
