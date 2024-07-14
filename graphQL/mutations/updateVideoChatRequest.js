const { AuthenticationError } = require("apollo-server");
const { User, ChatRequest } = require("../../models");
const { publishVideoChatRequest } = require("../subscription/subscription");

module.exports = {
  updateVideoChatRequestResolver: async (root, args, ctx) => {
    const {
      senderID,
      receiverID,
      status,
      _id,

      offer,
      answer,
      candidate,
    } = args;

    try {
      const updateData = {
        status,
        sender: senderID,
        receiver: receiverID,
      };

      // Add offer, answer, and candidate to updateData if they are present
      const inCall = status === "Accept" || status === "Pending" ? true : false;
      if (candidate) {
        const chatRequest = await ChatRequest.findById(_id);
        chatRequest.candidates.push(candidate);
        updateData.candidates = chatRequest.candidates;
      }

      const chatRequest = await ChatRequest.findByIdAndUpdate(
        { _id },
        updateData,
        { new: true }
      ).populate([
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

      const sender = await User.findByIdAndUpdate(
        { _id: senderID },
        { chatRequest, inCall },
        { new: true }
      ).populate("chatRequest");

      const receiver = await User.findByIdAndUpdate(
        { _id: receiverID },
        { chatRequest, inCall },
        { new: true }
      ).populate("chatRequest");

      publishVideoChatRequest(chatRequest);

      return chatRequest;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
