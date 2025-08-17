const { AuthenticationError } = require("apollo-server");
const { User, Picture } = require("../../models");
const cloudinary = require("cloudinary");
const axios = require("axios");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

module.exports = {
  deletePhotoResolver: async (root, args, ctx) => {
    const { photoId, userId } = args;

    try {
      // Get full picture doc to check provider + publicId
      const pic = await Picture.findById(photoId);
      if (!pic) throw new Error("Picture not found");

      const provider = pic.provider; // "Cloudflare" | "Cloudinary" | undefined
      const publicId = pic.publicId;

      // Best-effort remote delete (don't block DB cleanup if this fails)
      if (publicId) {
        try {
          if (provider === "Cloudflare") {
            if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
              throw new Error("Missing Cloudflare credentials");
            }
            await axios.delete(
              `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${publicId}`,
              { headers: { Authorization: `Bearer ${CF_API_TOKEN}` } }
            );
          } else {
            // Cloudinary (default if provider is null/undefined)
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (extErr) {
          // Log and continue; we still remove the DB reference
          console.warn(
            "Remote delete failed:",
            extErr.response || extErr.message
          );
        }
      }

      // Remove picture from DB
      await Picture.deleteOne({ _id: photoId });

      // Pull reference from user and return updated user (same as before)
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { pictures: photoId } },
        { new: true }
      )
        .populate("pictures")
        .populate("comments");

      if (!user.pictures.length) {
        await User.findByIdAndUpdate(
          { _id: userId },
          { profileComplete: false },
          { new: true }
        );
      }

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
