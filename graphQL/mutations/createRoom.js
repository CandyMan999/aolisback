const { AuthenticationError } = require("apollo-server");
const { User, Room, Comment } = require("../../models");
const { OpenAI } = require("openai");
const {
  publishCreateComment,
  publishRoomCreatedOrUpdated,
} = require("../subscription/subscription");
require("dotenv").config();
const moment = require("moment");

const openai = new OpenAI({
  organization: process.env.ORG,
  apiKey: process.env.OPEN_AI_KEY,
});

module.exports = {
  createRoomResolver: async (root, args, ctx) => {
    const { name, _id } = args;

    try {
      const room = await new Room({ name }).save();
      const user = await User.findByIdAndUpdate(
        { _id },
        {
          roomInfo: {
            subscribedAt: moment(),
            roomId: room._id,
          },
          room,
          isLoggedIn: true,
        },
        { new: true }
      )
        .populate("room")
        .populate("pictures");

      await Room.updateMany(
        { _id: { $ne: room._id } },
        { $pull: { users: user._id } },
        { multi: true }
      );

      const currentRoom = await Room.findByIdAndUpdate(
        {
          _id: room._id,
        },
        { $push: { users: user } },
        { new: true }
      ).populate("users");

      const rooms = await Room.find({}).populate("users");

      await Promise.all(
        rooms.map(async (room) => {
          const isAfterMin = moment(room.createdAt).isBefore(
            moment().subtract(30, "minutes")
          );

          await room.users.map(async (user) => {
            const isProbablyOffline = moment(
              user.roomInfo.subscribedAt
            ).isBefore(moment().subtract(30, "minutes"));

            if (isProbablyOffline) {
              await Room.updateMany({ $pull: { users: user._id } });
              await User.updateOne(
                { _id: user._id },
                { $set: { comments: [], isLoggedIn: false } }
              );
            }
          });

          if (!room.users.length && !!isAfterMin && room.name !== "Main") {
            await room.deleteOne({ _id: room._id });
          }
        })
      );

      if (currentRoom.name !== "Main" && !currentRoom.comments.length) {
        const prompt = `Human: Let's pretend this is a chat application with the topic of ${currentRoom.name}, introduce yourself to me as CandyMan, an artificial intelligence, my name is @${user.username}, then let me know that they I can chat with you while I wait for other users to join the room I just created.`;

        const responseAI = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Correct model name for the OpenAI AP
          messages: [{ role: "system", content: prompt }],
          temperature: 0.5,
          max_tokens: 3000,
          top_p: 1,
          frequency_penalty: 0.3,
          presence_penalty: 0.9,
          stop: [" Human:", " AI:"],
        });

        const commentAI = await new Comment({
          text: responseAI.choices[0].message.content,
        }).save();

        const roomAI = await Room.findByIdAndUpdate(
          { _id: room._id },
          { $push: { comments: commentAI } },
          { new: true }
        );

        const authorAI = await User.findByIdAndUpdate(
          { _id: "6686f5e8af94620002482764" },
          { $push: { comments: commentAI } },
          { new: true }
        ).populate("pictures");

        const newCommentAI = await Comment.findByIdAndUpdate(
          {
            _id: commentAI._id,
          },
          { author: authorAI, room: roomAI },
          { new: true }
        )
          .populate({
            path: "author",
            populate: [{ path: "pictures", model: "Picture" }],
          })
          .populate("room");

        publishCreateComment(newCommentAI);
      }

      const getAllRooms = await Room.find({}).populate("users");

      publishRoomCreatedOrUpdated(getAllRooms);
      return currentRoom;
    } catch (err) {
      throw new AuthenticationError(err);
    }
  },
};
