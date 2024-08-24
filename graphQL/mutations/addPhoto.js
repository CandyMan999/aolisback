const { AuthenticationError } = require("apollo-server");
const { User, Picture } = require("../../models");
const { publishFlagUser } = require("../subscription/subscription");
const { pushNotificationUserFlagged } = require("../../utils/middleware");

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
};
