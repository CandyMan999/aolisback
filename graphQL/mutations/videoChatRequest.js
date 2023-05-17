const { AuthenticationError } = require("apollo-server");
const { User, ChatRequest } = require("../../models");
const { publishVideoChatRequest } = require("../subscription/subscription");

module.exports = {
  videoChatRequestResolver: async (root, args, ctx) => {
    const { senderID, receiverID, status } = args;

    try {
      const chatRequest = await ChatRequest.create({
        status,
        sender: senderID,
        receiver: receiverID,
      });

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

      const newChatRequest = await ChatRequest.findOne({
        _id: chatRequest._id,
      }).populate([
        "blockedUsers",
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

      publishVideoChatRequest(newChatRequest);

      return newChatRequest;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },
};
