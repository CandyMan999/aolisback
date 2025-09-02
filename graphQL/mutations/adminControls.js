const { AuthenticationError } = require("apollo-server");
const { Video, Picture, User, Room, Comment, Like, Match } = require("../../models");
const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CF_API_TOKEN; // Cloudflare Images
const CF_STREAM_TOKEN = process.env.CF_STREAM_TOKEN; // Cloudflare Stream

if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
  console.warn(
    "[adminControls] Missing CF_ACCOUNT_ID and/or CF_API_TOKEN in env (Images)"
  );
}
if (!CF_ACCOUNT_ID || !CF_STREAM_TOKEN) {
  console.warn("[adminControls] Missing CF_STREAM_TOKEN in env (Stream)");
}

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

      if (picture.publicId) {
        try {
          await axios.delete(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${picture.publicId}`,
            { headers: { Authorization: `Bearer ${CF_API_TOKEN}` } }
          );
        } catch (e) {
          console.error("Failed to delete image from Cloudflare", e.message);
        }
      }

      // Remove the picture reference from the associated user
      await User.updateMany(
        { pictures: pictureId },
        { $pull: { pictures: pictureId } }
      );

      return picture;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },

  // --------------------- UPDATED: banUserResolver ---------------------
  banUserResolver: async (root, { userId }) => {
    try {
      // 1) Mark user as banned
      const user = await User.findByIdAndUpdate(
        userId,
        { isBanned: true },
        { new: true }
      );
      if (!user) {
        throw new AuthenticationError("User not found");
      }

      // Local import so other resolvers remain unchanged
      const axios = require("axios");

      // 2) Remove user from rooms & ban them there, and scrub kickVotes
      //    - remove from users
      //    - add to bannedUsers (only in rooms where they were present)
      await Room.updateMany(
        { users: userId },
        { $pull: { users: userId }, $addToSet: { bannedUsers: userId } }
      );

      //    - remove any votes where they are target
      await Room.updateMany({}, { $pull: { kickVotes: { target: userId } } });

      //    - remove them from any voters arrays
      await Room.updateMany(
        { "kickVotes.voters": userId },
        { $pull: { "kickVotes.$[].voters": userId } }
      );

      //    - sanitize malformed/null kickVotes entries
      await Room.updateMany(
        {},
        {
          $pull: {
            kickVotes: {
              $or: [{ target: { $exists: false } }, { target: null }],
            },
          },
        }
      );

      //    - remove null voters if any (ignore if server doesn't support $[])
      try {
        await Room.updateMany({}, { $pull: { "kickVotes.$[].voters": null } });
      } catch (e) {}

      //    - optionally remove empty voter entries (ignore if unsupported)
      try {
        await Room.updateMany(
          { "kickVotes.voters": { $size: 0 } },
          { $pull: { kickVotes: { voters: { $size: 0 } } } }
        );
      } catch (e) {}

      // 3) Remove their comments & references to them
      const authoredComments = await Comment.find(
        { author: userId },
        { _id: 1 }
      );
      const authoredIds = authoredComments.map((c) => c._id);

      if (authoredIds.length > 0) {
        // delete the user's comments
        await Comment.deleteMany({ _id: { $in: authoredIds } });

        // pull comment ids from rooms
        await Room.updateMany(
          { comments: { $in: authoredIds } },
          { $pull: { comments: { $in: authoredIds } } }
        );

        // null out replyTo on comments that replied to theirs
        await Comment.updateMany(
          { replyTo: { $in: authoredIds } },
          { $set: { replyTo: null } }
        );
      }

      // 4) Delete all pictures they own (Cloudflare Images or Cloudinary)
      const pictures = await Picture.find({ user: userId });
      if (pictures && pictures.length) {
        for (let i = 0; i < pictures.length; i++) {
          const picture = pictures[i];
          if (picture.publicId) {
            try {
              if (picture.provider === "Cloudflare") {
                await axios.delete(
                  `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${picture.publicId}`,
                  { headers: { Authorization: `Bearer ${CF_API_TOKEN}` } }
                );
              } else {
                await cloudinary.uploader.destroy(picture.publicId);
              }
            } catch (e) {
              console.warn("Failed remote picture delete:", e && e.message);
            }
          }
          await Picture.deleteOne({ _id: picture._id });
        }

        // remove picture references from user doc (defense-in-depth)
        await User.updateMany(
          { pictures: { $in: pictures.map((p) => p._id) } },
          { $pull: { pictures: { $in: pictures.map((p) => p._id) } } }
        );
      }

      // 5) Delete videos sent/received by this user from DB and Cloudflare Stream
      const sentVideos = await Video.find({ sender: userId }); // user's outgoing
      const receivedVideos = await Video.find({ receiver: userId }); // user's inbox

      const streamIds = []; // Cloudflare Stream UIDs from publicId

      // Sent videos: remove from receivers' inboxes, delete docs, collect UIDs
      for (let i = 0; i < sentVideos.length; i++) {
        const v = sentVideos[i];
        if (v.publicId) streamIds.push(String(v.publicId));

        if (v.receiver) {
          await User.findByIdAndUpdate(v.receiver, {
            $pull: { receivedVideos: v._id },
          });
        }
        await Video.deleteOne({ _id: v._id });
      }

      // Received videos: remove from senders' sent arrays if tracked, delete docs, collect UIDs
      for (let j = 0; j < receivedVideos.length; j++) {
        const rv = receivedVideos[j];
        if (rv.publicId) streamIds.push(String(rv.publicId));

        if (rv.sender) {
          await User.findByIdAndUpdate(rv.sender, {
            $pull: { sentVideos: rv._id },
          });
        }
        await Video.deleteOne({ _id: rv._id });
      }

      // Remote delete from Cloudflare Stream (uses publicId as the UID)
      if (streamIds.length && CF_STREAM_TOKEN && CF_ACCOUNT_ID) {
        const toDelete = Array.from(new Set(streamIds.filter(Boolean)));
        const results = await Promise.allSettled(
          toDelete.map((uid) =>
            axios.delete(
              `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${uid}`,
              {
                headers: { Authorization: `Bearer ${CF_STREAM_TOKEN}` },
                timeout: 20000,
              }
            )
          )
        );
        const failed = results.filter((r) => r.status === "rejected");
        if (failed.length) {
          console.warn(
            "[banUser] Some Cloudflare Stream deletions failed:",
            failed.length
          );
        }
      }

      // 6) Remove references to this user from other users
      await Promise.all([
        Like.deleteMany({ $or: [{ user: userId }, { target: userId }] }),
        Match.deleteMany({ users: userId }),
        User.updateMany(
          { blockedUsers: userId },
          { $pull: { blockedUsers: userId } }
        ),
      ]);

      // 7) Publish updated rooms so UIs refresh live
      const allRooms = await Room.find({})
        .populate("users")
        .populate("kickVotes.target")
        .populate("kickVotes.voters")
        .populate("bannedUsers");

      publishRoomCreatedOrUpdated(allRooms);

      return user;
    } catch (err) {
      throw new Error(`Failed to ban user and clean up: ${err.message}`);
    }
  },
  // --------------------------------------------------------------------

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
          try {
            const data = await Picture.findById(pic._id);
            if (data && data.publicId) {
              await cloudinary.uploader.destroy(data.publicId);
            }
            await Picture.deleteOne({ _id: pic._id });
          } catch (err) {
            console.log(err);
          }
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
