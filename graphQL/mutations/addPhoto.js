const { AuthenticationError } = require("apollo-server");
const { User, Picture } = require("../../models");

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
};
