const { AuthenticationError } = require("apollo-server");
const { User, Video } = require("../../models");

const cloudinary = require("cloudinary");
const moment = require("moment");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
  deleteVideoResolver: async (root, args, ctx) => {
    const { _id } = args;
    try {
      const videos = await Video.find({
        $or: [{ sender: _id }, { receiver: _id }],
      });

      const publicIDs = [];
      let senderNew;
      videos.map(async (video) => {
        const pastDue = moment(video.createdAt).isBefore(
          moment().subtract(7, "days")
        );

        if (pastDue) {
          publicIDs.push(video.publicId);
          const receiver = video.receiver._id;
          const sender = video.sender._id;

          const data = await Video.deleteOne({ _id: video._id });

          const receiverNew = await User.findByIdAndUpdate(
            { _id: receiver },
            { $pull: { receivedVideos: video._id } },
            { new: true }
          );

          senderNew = await User.findByIdAndUpdate(
            { _id: sender },
            { $pull: { sentVideos: video._id } },
            { new: true }
          );
        }
      });
      if (!!publicIDs.length) {
        const filterIDs = publicIDs.filter(
          (id) => id !== "wy3ybqezw97wiqtst5nm"
        );
        await cloudinary.api.delete_resources(
          filterIDs,
          function (result) {
            console.log(result);
          },
          { resource_type: "video" }
        );
      }

      const updatedVideos = await Video.find().populate([
        {
          path: "sender",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        },
        {
          path: "receiver",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        },
      ]);

      return updatedVideos;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
