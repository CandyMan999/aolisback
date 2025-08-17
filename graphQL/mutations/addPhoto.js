const { AuthenticationError } = require("apollo-server");
const { User, Picture } = require("../../models");
const { publishFlagUser } = require("../subscription/subscription");
const { pushNotificationUserFlagged } = require("../../utils/middleware");
const axios = require("axios");

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID; // e.g. 367247...
const CF_API_TOKEN = process.env.CF_API_TOKEN; // API Token with Images:Edit

if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
  // Don’t crash app startup, but you’ll get a clear error the first time it’s called
  console.warn(
    "[photo resolvers] Missing CF_ACCOUNT_ID and/or CF_API_TOKEN in env"
  );
}

module.exports = {
  addPhotoResolver: async (root, args, ctx) => {
    const { _id, url, publicId } = args;
    try {
      const picture = await Picture.create({ url, publicId });
      const user = await User.findByIdAndUpdate(
        { _id },
        { $push: { pictures: picture } },
        { new: true }
      ).populate("pictures");

      if (user.pictures.length >= 4 && user.phoneNumber) {
        await User.findByIdAndUpdate(
          { _id },
          { profileComplete: true },
          { new: true }
        ).populate("pictures");
      }
      await Picture.findByIdAndUpdate(
        { _id: picture._id },
        { user },
        { new: true }
      );

      return user;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  flagPhotoResolver: async (root, args, ctx) => {
    const { url, publicId, flaggedUserID } = args;

    try {
      const picture = await Picture.create({ url, publicId, flagged: true });
      const user = await User.findById(flaggedUserID);
      const flaggedPic = await Picture.findByIdAndUpdate(
        { _id: picture._id },
        { user },
        { new: true }
      ).populate("user");

      publishFlagUser(flaggedPic);
      pushNotificationUserFlagged("ExponentPushToken[PtoiwgLjWKaXTzEaTY0jbT]");
      return flaggedPic;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
  directUploadResolver: async (root, args, ctx) => {
    try {
      if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
        throw new Error(
          "Cloudflare credentials missing (CF_ACCOUNT_ID / CF_API_TOKEN)"
        );
      }

      const resp = await axios.post(
        "https://api.cloudflare.com/client/v4/accounts/" +
          CF_ACCOUNT_ID +
          "/images/v2/direct_upload",
        null,
        { headers: { Authorization: "Bearer " + CF_API_TOKEN } }
      );

      const data = resp && resp.data ? resp.data : null;
      const ok = data && data.success === true;
      const result = ok && data.result ? data.result : null;
      const uploadURL = result && result.uploadURL ? result.uploadURL : null;
      const id = result && result.id ? result.id : null;

      console.log("what is this: ", resp.data);

      if (!ok || !uploadURL || !id) {
        throw new Error(
          "Cloudflare direct upload failed: " + JSON.stringify(data)
        );
      }

      return { uploadURL: uploadURL, id: id };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
