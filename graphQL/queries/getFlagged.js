const { AuthenticationError } = require("apollo-server");
const { Video, Picture } = require("../../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
  getFlaggedVideosResolver: async () => {
    try {
      const videos = await Video.find({ flagged: true }).populate(
        "sender receiver"
      );
      return videos;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  getFlaggedPicturesResolver: async () => {
    try {
      const pictures = await Picture.find({ flagged: true }).populate("user");
      return pictures;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
