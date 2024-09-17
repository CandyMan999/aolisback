const { Queue, User } = require("../../models");
const { AuthenticationError } = require("apollo-server");
const { publishMatchedUser } = require("../subscription/subscription");

module.exports = {
  addToQueueResolver: async (root, args, ctx) => {
    try {
      const { userId, sex, lookingFor } = args;
      // Check if the user is already in the queue
      const existingQueueEntry = await Queue.findOne({ userId });

      await User.findByIdAndUpdate(
        { _id: userId },
        { inCall: false },
        { new: true }
      );

      if (existingQueueEntry) {
        const updatedData = await Queue.findOneAndUpdate(
          { userId },
          {
            $set: {
              status: "Waiting",
              pairedUser: null,
            },
          },
          { new: true }
        ).populate("pairedUser");

        publishMatchedUser(updatedData);

        return updatedData;
      }

      const newQueueEntry = new Queue({
        userId,
        sex,
        lookingFor,
        status: "Waiting",
        "location.coordinates": ctx.currentUser.location.coordinates,
      }).save();
      publishMatchedUser(newQueueEntry);
      return newQueueEntry;
    } catch (error) {
      throw new Error("Failed to add user to queue");
    }
  },
  matchUserResolver: async (root, { userId }, ctx) => {
    try {
      // Atomically update and retrieve the current user from the queue, ensuring they're not already being matched
      const currentUser = await Queue.findOneAndUpdate(
        { userId, status: "Waiting" },
        { $set: { status: "Deciding" } } //lock the user to prevent concurrent call bugs
      );

      if (!currentUser) {
        return new AuthenticationError(
          "User not found in queue or is already being matched"
        );
      }

      // Get the list of blocked users from the context
      const blockedUsers =
        ctx.currentUser.blockedUsers.map((user) => user._id.toString()) || [];

      let match = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 10; // To avoid infinite loops
      const distancesInMiles = [
        5, 25, 50, 75, 100, 200, 500, 1000, 3000, 12500,
      ]; // Distances in miles, last one being half the Earth's circumference

      while (!match && attempts < MAX_ATTEMPTS) {
        //update the match with my info
        const distance = distancesInMiles[attempts];
        const maxDistanceInMeters = distance * 1609.34; // Convert miles to meters (1 mile = 1609.34 meters)

        match = await Queue.findOneAndUpdate(
          {
            sex: currentUser.lookingFor,
            lookingFor: currentUser.sex,
            status: "Waiting", // Match users who are still waiting
            pairedUser: null, // user has not been matched yet
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: currentUser.location.coordinates, // The order is [longitude, latitude]
                },
                $maxDistance: maxDistanceInMeters,
              },
            },
            userId: {
              $ne: currentUser.userId, // exclude self
              $nin: [...blockedUsers, ...currentUser.previousMatches], //exclude blocked users and current session past matches
            },
          },
          { $set: { status: "Deciding", pairedUser: userId } }, // Lock the matched user by setting their status to "Deciding"
          { new: true }
        ).populate("pairedUser");

        if (!match) {
          attempts++;
          continue; // Retry if no match found
        }
        //find myself and update with the match
        await Queue.findOneAndUpdate(
          {
            userId,
          },
          { $set: { status: "Deciding", pairedUser: match.userId } },
          { new: true }
        ).populate("pairedUser");

        // Check if the matched user has blocked the current user
        const matchedUserData = await User.findById(match.userId).select(
          "blockedUsers"
        );
        const matchedUserBlockedUsers =
          matchedUserData.blockedUsers.map((blockedUserId) =>
            blockedUserId.toString()
          ) || [];

        if (matchedUserBlockedUsers.includes(currentUser.userId.toString())) {
          // Reset both users' statuses if the match is blocked
          await Queue.findOneAndUpdate(
            { userId: currentUser.userId },
            { $set: { status: "Waiting", pariedUser: null } },
            { new: true }
          );
          await Queue.findOneAndUpdate(
            { userId: match.userId },
            { $set: { status: "Waiting", pariedUser: null } },
            { new: true }
          );
          match = null; // Reset match and retry
          attempts++;
          continue;
        }

        // Reload the updated current user and the matched user
        const updatedCurrentUser = await Queue.findOneAndUpdate(
          {
            userId: currentUser.userId,
          },
          { $push: { previousMatches: match.userId } },
          { new: true }
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        const updatedMatch = await Queue.findOneAndUpdate(
          {
            userId: match.userId,
          },
          { $push: { previousMatches: currentUser.userId } },
          { new: true }
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

      // If no match is found after MAX_ATTEMPTS, reset status and return null
      if (!match && attempts >= MAX_ATTEMPTS) {
        console.log("Max attempts reached. No valid match found.");
        await Queue.updateOne(
          { userId: currentUser.userId },
          { $set: { status: "Waiting", pairedUser: null } }
        );
        return null;
      }
    } catch (error) {
      // Reset the status of the current user in case of error

      throw new Error(error.message || "Failed to match user");
    }
  },
  updateMatchStatusResolver: async (root, { userId, status }, ctx) => {
    try {
      // Atomically find the current user in the queue
      const currentUser = await Queue.findOneAndUpdate(
        { userId, status: { $in: ["Deciding", "Connected", "Accept"] } }, // Only proceed if the user is in "Deciding" or "Connected" , or "Accept" status
        { new: true }
      );

      if (!currentUser) {
        throw new AuthenticationError(
          "User not found in queue or invalid status."
        );
      }

      // Check if the current user has a paired user
      if (!currentUser.pairedUser) {
        throw new Error("No match found for the current user.");
      }

      // Find the paired user
      const pairedUser = await Queue.findOne({
        userId: currentUser.pairedUser,
      });

      if (!pairedUser) {
        throw new Error("Paired user not found.");
      }

      if (status === "Cancel") {
        // If status is "Cancel", reset both users' status to "Cancel"
        const cancelledSelf = await Queue.findOneAndUpdate(
          { userId: currentUser.userId },
          { status: "Cancel" },
          { new: true }
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: { path: "pictures", model: "Picture" },
        });
        const cancelledPairedUser = await Queue.findOneAndUpdate(
          { userId: pairedUser.userId },
          { status: "Cancel" },
          { new: true }
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: { path: "pictures", model: "Picture" },
        });

        // Notify both users that the match was canceled
        publishMatchedUser(cancelledSelf);
        publishMatchedUser(cancelledPairedUser);

        return { message: "Match cancelled, both users returned to Waiting." };
      } else if (status === "Accept") {
        // Atomically update the current user status to "Accept"
        const updatedCurrentUser = await Queue.findOneAndUpdate(
          { userId: currentUser.userId, status: "Deciding" }, // Only proceed if the status is still "Deciding"
          { status: "Accept" },
          { new: true }
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: { path: "pictures", model: "Picture" },
        });

        publishMatchedUser(updatedCurrentUser);

        // Check if the paired user has also accepted
        if (pairedUser.status === "Accept") {
          // If both users have accepted, set both to "Connected"
          const finalCurrentUser = await Queue.findOneAndUpdate(
            { userId: currentUser.userId },
            { status: "Connected" },
            {
              new: true,
            }
          ).populate({
            path: "pairedUser",
            model: "User",
            populate: { path: "pictures", model: "Picture" },
          });
          const finalPairedUser = await Queue.findOneAndUpdate(
            { userId: pairedUser.userId },
            { status: "Connected" },
            {
              new: true,
            }
          ).populate({
            path: "pairedUser",
            model: "User",
            populate: { path: "pictures", model: "Picture" },
          });

          // Publish the connected event to both users
          publishMatchedUser(finalCurrentUser);
          publishMatchedUser(finalPairedUser);

          return { message: "Both users accepted and are now connected." };
        } else {
          // If the other user hasn't accepted yet, return the waiting message
          return { message: "Waiting for the other user to accept." };
        }
      } else {
        throw new Error("Invalid status provided.");
      }
    } catch (error) {
      throw new Error(error.message || "Failed to update match status.");
    }
  },
  removeFromQueueResolver: async (root, { userId, isLoggedIn }, ctx) => {
    try {
      // Find the user in the queue

      await User.findByIdAndUpdate(
        { _id: userId },
        { inCall: false, isLoggedIn },
        { new: true }
      );
      const queueEntry = await Queue.findOne({ userId }).populate("pairedUser");

      if (!queueEntry) {
        throw new AuthenticationError("User not found in the queue");
      }

      if (queueEntry.pairedUser) {
        // If the user is paired, update the paired user's status to "Cancel"

        const cancelledPairedUser = await Queue.findOneAndUpdate(
          {
            userId: queueEntry.pairedUser._id,
          },
          { status: "Cancel" },
          { new: true }
        ).populate({
          path: "pairedUser",
          model: "User",
          populate: {
            path: "pictures",
            model: "Picture",
          },
        });

        await User.findByIdAndUpdate(
          { _id: queueEntry.pairedUser._id },
          { inCall: false },
          { new: true }
        );

        publishMatchedUser(cancelledPairedUser);
      }

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
