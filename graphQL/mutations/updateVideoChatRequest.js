const { AuthenticationError } = require("apollo-server");
const { User, ChatRequest } = require("../../models");
const { publishVideoChatRequest } = require("../subscription/subscription");

module.exports = {
  updateVideoChatRequestResolver: async (root, args, ctx) => {
    const { senderID, receiverID, status, _id } = args;

    try {
      const chatRequest = await ChatRequest.findByIdAndUpdate(
        { _id },
        {
          status,
          sender: senderID,
          receiver: receiverID,
        },
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
        { chatRequest },
        { new: true }
      ).populate("chatRequest");

      const receiver = await User.findByIdAndUpdate(
        { _id: receiverID },
        { chatRequest },
        { new: true }
      ).populate("chatRequest");

      publishVideoChatRequest(chatRequest);

      return chatRequest;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
