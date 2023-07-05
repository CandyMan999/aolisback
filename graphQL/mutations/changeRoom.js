const { AuthenticationError, gql, PubSub } = require("apollo-server");
const { User, Room, Comment } = require("../../models");
const { Configuration, OpenAIApi } = require("openai");
const {
  publishCreateComment,
  publishRoomCreatedOrUpdated,
} = require("../subscription/subscription");
require("dotenv").config();
const moment = require("moment");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  changeRoomResolver: async (root, args, ctx) => {
    const { roomId, userId } = args;

    try {
      const room = await Room.findById({ _id: roomId });

      const user = await User.findByIdAndUpdate(
        { _id: userId },
        {
          roomInfo: {
            subscribedAt: moment(),
            roomId: room._id,
          },
          isLoggedIn: true,
          room,
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
        { $addToSet: { users: user } },
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

      if (currentRoom.name === "Main" && !currentRoom.comments.length) {
        const prompt = `Human: Let's pretend this is a new chat app about dating where you can create profiles, video chat, share location, and create chatrooms of particular interest; please welcome me to "GoneChatting.com" and tell the slogan, "slogan: where you will never catch a catfish".  and give me a short description of the app. Give me a random quote about love ask me a random personal question about literally anything.`;

        const responseAI = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          temperature: 0.9,
          max_tokens: 250,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: [" Human:", " AI:"],
        });

        const commentAI = await new Comment({
          text: responseAI.data.choices[0].text,
        }).save();

        const roomAI = await Room.findByIdAndUpdate(
          { _id: roomId },
          { $push: { comments: commentAI } },
          { new: true }
        );

        const authorAI = await User.findByIdAndUpdate(
          { _id: "64a5e79edee5a900144d96bf" },
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
