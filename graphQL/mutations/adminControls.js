const { AuthenticationError } = require("apollo-server");
const { Video, Picture, User, Room, Comment } = require("../../models");
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
      // Ban the user
      const user = await User.findByIdAndUpdate(
        userId,
        { isBanned: true },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      // Fetch all videos and pictures associated with the user
      const videos = await Video.find({ sender: userId });
      const pictures = await Picture.find({ user: userId });

      // Delete all videos from Cloudinary and the database
      const deleteVideoPromises = videos.map(async (video) => {
        if (video.publicId) {
          await cloudinary.api.delete_resources([video.publicId], {
            resource_type: "video",
          });
        }
        await Video.findByIdAndDelete(video._id);
      });

      // Delete all pictures from Cloudinary and the database
      const deletePicturePromises = pictures.map(async (picture) => {
        if (picture.publicId) {
          await cloudinary.api.delete_resources([picture.publicId], {
            resource_type: "image",
          });
        }
        await Picture.findByIdAndDelete(picture._id);
      });

      // Clean up references to the user's videos and pictures in other collections
      await Promise.all([
        ...deleteVideoPromises,
        ...deletePicturePromises,
        // Remove references to videos in other users' receivedVideos arrays
        User.updateMany(
          { receivedVideos: { $in: videos.map((v) => v._id) } },
          { $pull: { receivedVideos: { $in: videos.map((v) => v._id) } } }
        ),
        // Remove references to pictures in comments and rooms
        Comment.updateMany(
          { picture: { $in: pictures.map((p) => p._id) } },
          { $unset: { picture: "" } }
        ),
        Room.updateMany(
          { comments: { $in: user.comments } },
          { $pull: { comments: { $in: user.comments } } }
        ),
        // Remove references to the user in other users' matchedUsers, likedUsers, etc.
        User.updateMany(
          { matchedUsers: userId },
          { $pull: { matchedUsers: userId } }
        ),
        User.updateMany(
          { likedUsers: userId },
          { $pull: { likedUsers: userId } }
        ),
        User.updateMany(
          { usersLikedMe: userId },
          { $pull: { usersLikedMe: userId } }
        ),
        User.updateMany(
          { blockedUsers: userId },
          { $pull: { blockedUsers: userId } }
        ),
        // Optionally remove the user from any other custom fields where they might be referenced
      ]);

      return user;
    } catch (err) {
      throw new Error(`Failed to ban user and clean up: ${err.message}`);
    }
  },
  deleteSeedersResolver: async (root, args, ctx) => {
    try {
      const SEEDERS = await User.find({ seeder: true }).populate([
        "pictures",
        "comments",
        "sentVideos",
        "blockedUsers",
        "receivedVideos",
      ]);

      const deleteUserAndAssociatedData = async (user) => {
        // Delete all pictures
        for (const pic of user.pictures) {
          const data = await Picture.findById(pic._id);
          if (data && data.publicId) {
            await cloudinary.uploader.destroy(data.publicId);
          }
          await Picture.deleteOne({ _id: pic._id });
        }

        // Delete all comments
        for (const comment of user.comments) {
          await Comment.deleteOne({ _id: comment._id });
        }

        // Delete all videos
        const publicIDs = [];
        for (const video of user.sentVideos) {
          const videoData = await Video.findById(video);
          if (videoData) {
            publicIDs.push(videoData.publicId);
            if (videoData.receiver) {
              await User.findByIdAndUpdate(
                { _id: videoData.receiver },
                { $pull: { receivedVideos: videoData._id } }
              );
            }
            await Video.deleteOne({ _id: videoData._id });
          }
        }
        for (const video of user.receivedVideos) {
          const videoData = await Video.findById(video);
          if (videoData) {
            publicIDs.push(videoData.publicId);
            await Video.deleteOne({ _id: videoData._id });
          }
        }

        if (publicIDs.length) {
          await cloudinary.api.delete_resources(publicIDs, {
            resource_type: "video",
          });
        }

        // Delete user
        await User.deleteOne({ _id: user._id });
      };

      // Deleting all users except the excluded user
      await Promise.all(
        SEEDERS.map((user) => deleteUserAndAssociatedData(user))
      );

      return { status: true };
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
