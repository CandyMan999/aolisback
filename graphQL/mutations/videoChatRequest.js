const { AuthenticationError } = require("apollo-server");
const { User, ChatRequest } = require("../../models");
const { publishVideoChatRequest } = require("../subscription/subscription");

module.exports = {
  videoChatRequestResolver: async (root, args, ctx) => {
    const { senderID, receiverID, status, offer, answer, candidate } = args;

    const updateData = {
      status,
      sender: senderID,
      receiver: receiverID,
    };

    // Add offer, answer, and candidate to updateData if they are present
    if (offer) updateData.offer = offer;
    if (answer) updateData.answer = answer;
    try {
      const chatRequest = await ChatRequest.create(updateData);

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
