const { AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const { Room, User } = require("../../models");
const { publishRoomCreatedOrUpdated } = require("../subscription/subscription");
const {
  pushNotificationVoteCast,
  pushNotificationVoteReceived,
  pushNotificationKickedOut,
} = require("../../utils/middleware");

module.exports = {
  voteToKickResolver: async (_root, args, _ctx) => {
    const { roomId, userId, targetUserId } = args;

    try {
      const room = await Room.findById(roomId);
      if (!room) throw new AuthenticationError("Room not found");

      const userObjId = new mongoose.Types.ObjectId(userId);
      const targetObjId = new mongoose.Types.ObjectId(targetUserId);

      // Already banned? just return the current state
      if (
        room.bannedUsers.length &&
        room.bannedUsers.some((u) => u.toString() === targetUserId)
      ) {
        return Room.findById(roomId)
          .populate("users")
          .populate("kickVotes.target")
          .populate("kickVotes.voters");
      }

      // Find existing vote entry by index so we can mutate safely
      let idx = room.kickVotes.findIndex(
        (v) => v.target.toString() === targetUserId
      );
      if (idx === -1) {
        room.kickVotes.push({ target: targetObjId, voters: [] });
        idx = room.kickVotes.length - 1;
      }

      const voteEntry = room.kickVotes[idx];

      // Toggle vote
      const voterIdx = voteEntry.voters.findIndex((v) => {
        // v may be string or ObjectId; normalize
        return v.toString() === userId;
      });

      let addedVote = false;
      if (voterIdx >= 0) {
        voteEntry.voters.splice(voterIdx, 1);
        // drop empty entry
        if (voteEntry.voters.length === 0) {
          room.kickVotes.splice(idx, 1);
        }
      } else {
        voteEntry.voters.push(userObjId);
        addedVote = true;
      }

      // Make sure Mongoose persists nested changes even if kickVotes is Mixed/plain array
      room.markModified && room.markModified("kickVotes");

      // Persist first
      await room.save();

      // Re-read the fresh room for accurate counts after save
      let updatedRoom = await Room.findById(roomId)
        .populate("users")
        .populate("kickVotes.target")
        .populate("kickVotes.voters");

      // Send notifications AFTER we know the save stuck
      if (addedVote) {
        const [voter, targetUser] = await Promise.all([
          User.findById(userId),
          User.findById(targetUserId),
        ]);
        if (voter) {
          pushNotificationVoteCast(
            voter.expoToken,
            targetUser.username || "",
            room.name
          );
        }
        if (targetUser) {
          pushNotificationVoteReceived(
            targetUser.expoToken,
            voter.username || "",
            room.name
          );
        }
      }

      // Kick threshold: keep these numbers in sync with your product spec.
      const KICK_THRESHOLD = 5;
      const currentEntry = updatedRoom.kickVotes.find(
        (v) => v.target._id.toString() === targetUserId
      );
      const votesCount = currentEntry ? currentEntry.voters.length : 0;

      if (votesCount >= KICK_THRESHOLD) {
        await Room.findByIdAndUpdate(roomId, {
          $pull: { users: targetObjId },
          $addToSet: { bannedUsers: targetObjId },
        });

        const targetUser = await User.findById(targetUserId);
        if (targetUser)
          pushNotificationKickedOut(targetUser.expoToken, room.name);

        updatedRoom = await Room.findById(roomId)
          .populate("users")
          .populate("kickVotes.target")
          .populate("kickVotes.voters");
      }

      // Publish and return
      const allRooms = await Room.find({})
        .populate("users")
        .populate("kickVotes.target")
        .populate("kickVotes.voters")
        .populate("bannedUsers");
      publishRoomCreatedOrUpdated(allRooms);

      return updatedRoom;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
