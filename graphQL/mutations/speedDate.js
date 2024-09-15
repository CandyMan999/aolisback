const { Queue, User } = require("../../models");
const { AuthenticationError } = require("apollo-server");
const { publishMatchedUser } = require("../subscription/subscription");

module.exports = {
  addToQueueResolver: async (root, args, ctx) => {
    try {
      const { userId, sex, lookingFor } = args;
      // Check if the user is already in the queue
      const existingQueueEntry = await Queue.findOne({ userId });

      if (existingQueueEntry) {
        await Queue.updateOne(
          { userId },
          {
            status: "Waiting",
            pairedUser: null,
          },
          { new: true }
        );
        return;
      }

      const newQueueEntry = new Queue({
        userId,
        sex,
        lookingFor,
        status: "Waiting",
        "location.coordinates": ctx.currentUser.location.coordinates,
      }).save();

      return newQueueEntry;
    } catch (error) {
      throw new Error("Failed to add user to queue");
    }
  },
  matchUserResolver: async (root, { userId }, ctx) => {
    try {
      // Get the current user from the queue
      const currentUser = await Queue.findOne({ userId });
      if (!currentUser) {
        throw new AuthenticationError("User not found in queue");
      }

      // Get the list of blocked users from the context
      const blockedUsers =
        ctx.currentUser.blockedUsers.map((user) => user._id.toString()) || [];

      // A loop to keep searching for a valid match
      let match;
      let attempts = 0; // Optional, limit the number of attempts to avoid infinite loop
      const MAX_ATTEMPTS = 5; // Set a max number of attempts to prevent infinite loops

      while (!match && attempts < MAX_ATTEMPTS) {
        // Find a match based on the user's `lookingFor` preferences
        match = await Queue.findOne({
          sex: currentUser.lookingFor, // Match based on the "lookingFor" field
          lookingFor: currentUser.sex, // Match based on who is looking for their sex
          status: "Waiting", // Make sure the matched user is also waiting
          userId: { $ne: currentUser.userId, $nin: blockedUsers }, // Exclude the current user and blocked users
        });

        if (!match) {
          attempts++;
          console.log(`Attempt ${attempts}: No valid match found yet`);
          continue; // Retry finding a match if none is found
        }

        // Fetch the matched user's blocked users
        const matchedUserData = await User.findById(match.userId).select(
          "blockedUsers"
        );
        const matchedUserBlockedUsers =
          matchedUserData.blockedUsers.map((blockedUserId) =>
            blockedUserId.toString()
          ) || [];

        console.log("other user data: ", matchedUserBlockedUsers);

        // Check if the matched user has blocked the current user
        if (matchedUserBlockedUsers.includes(currentUser.userId.toString())) {
          console.log("Matched user has blocked the current user. Retrying...");
          match = null; // Reset match and retry
          attempts++;
          continue;
        }

        // If a valid match is found, update the status of both users to "Deciding"
        await Queue.updateOne(
          { userId: currentUser.userId },
          { status: "Deciding", pairedUser: match.userId }
        );
        await Queue.updateOne(
          { userId: match.userId },
          { status: "Deciding", pairedUser: currentUser.userId }
        );

        // Reload the updated current user to include the pairedUserId
        const updatedCurrentUser = await Queue.findOneAndUpdate(
          { userId: currentUser.userId },
          { new: true } // Return the updated document
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        const updatedMatch = await Queue.findOneAndUpdate(
          { userId: match.userId },
          { new: true } // Return the updated document
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        // Publish the match event to notify both users
        publishMatchedUser(updatedMatch);
        publishMatchedUser(updatedCurrentUser);

        return updatedMatch; // Return the matched user data
      }

      // If no match is found after MAX_ATTEMPTS, return null
      if (!match) {
        console.log("Max attempts reached. No valid match found.");
        return null;
      }
    } catch (error) {
      throw new Error(error.message || "Failed to match user");
    }
  },
  updateMatchStatusResolver: async (root, { userId, status }, ctx) => {
    try {
      // Get the current user from the queue
      const currentUser = await Queue.findOne({ userId });
      if (!currentUser) {
        throw new AuthenticationError("User not found in queue");
      }

      // Check if the user has a paired user
      if (!currentUser.pairedUser) {
        throw new Error("No match found for the current user");
      }

      const pairedUser = await Queue.findOne({
        userId: currentUser.pairedUser,
      });

      if (!pairedUser) {
        throw new Error("Paired user not found");
      }

      if (status === "Cancel") {
        // If status is "Cancel", reset both users' status to cancel which closes modal and retriggers adding to queue
        await Queue.updateOne(
          { userId: currentUser.userId },
          { status: "Cancel" }
        );
        await Queue.updateOne(
          { userId: pairedUser.userId },
          { status: "Cancel" }
        );

        const cancelledSelf = await Queue.findOne({
          userId: currentUser.userId,
        }).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });
        const cancelledPairedUser = await Queue.findOne({
          userId: pairedUser.userId,
        }).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        console.log("canceled: ", cancelledSelf);

        // Notify both users that the match was cancelled
        publishMatchedUser(cancelledSelf);
        publishMatchedUser(cancelledPairedUser);

        return { message: "Match cancelled, both users returned to Waiting." };
      } else if (status === "Accept") {
        // Update the current user's status to "Accept"
        const userQueueStatus = await Queue.findOneAndUpdate(
          { userId: currentUser.userId },
          { status: "Accept" },
          { new: true }
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        publishMatchedUser(userQueueStatus);
        // Check if the paired user has also accepted
        if (pairedUser.status === "Accept") {
          // If both users have accepted, set both to "Connected"
          await Queue.updateOne(
            { userId: currentUser.userId },
            { status: "Connected" }
          );
          await Queue.updateOne(
            { userId: pairedUser.userId },
            { status: "Connected" }
          );

          // Notify both users they are connected
          const updatedCurrentUser = await Queue.findOne({
            userId: currentUser.userId,
          }).populate({
            path: "pairedUser",
            model: "User",
            populate: {
              path: "pictures",
              model: "Picture",
            },
          });

          const updatedPairedUser = await Queue.findOne({
            userId: pairedUser.userId,
          }).populate({
            path: "pairedUser",
            model: "User",
            populate: {
              path: "pictures",
              model: "Picture",
            },
          });

          // Publish the connected event
          publishMatchedUser(updatedCurrentUser);
          publishMatchedUser(updatedPairedUser);

          return { message: "Both users accepted and are now connected" };
        } else {
          // If the other user hasn't accepted yet, return the waiting message
          return { message: "Waiting for the other user to accept" };
        }
      } else {
        throw new Error("Invalid status provided");
      }
    } catch (error) {
      throw new Error(error.message || "Failed to update match status");
    }
  },
  removeFromQueueResolver: async (root, { userId }, ctx) => {
    try {
      // Find the user in the queue
      const queueEntry = await Queue.findOne({ userId }).populate("pairedUser");

      if (!queueEntry) {
        throw new AuthenticationError("User not found in the queue");
      }

      if (queueEntry.pairedUser) {
        // If the user is paired, update the paired user's status to "Cancel"

        await Queue.updateOne(
          { userId: queueEntry.pairedUser._id },
          { status: "Cancel" }
        );

        // Publish a cancellation notification to the paired user
        const cancelledPairedUser = await Queue.findOne({
          userId: queueEntry.pairedUser,
        }).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        publishMatchedUser(cancelledPairedUser);
      }

      await User.findByIdAndUpdate(
        { _id: userId },
        { inCall: false },
        { new: true }
      );

      // Remove the user from the queue by deleting their entry
      await Queue.deleteMany({ userId });

      return { message: "User successfully removed from the queue" };
    } catch (error) {
      throw new AuthenticationError(
        error.message || "Error removing user from the queue"
      );
    }
  },
};
