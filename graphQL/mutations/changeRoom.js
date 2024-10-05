const { AuthenticationError, gql, PubSub } = require("apollo-server");
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
        const prompt = `Human: Let's pretend this is a new chat app about dating where you can create profiles, video chat, browse users on our interactive world map, and create chatrooms of particular interest and our newest feature is VIDEO SPEED DATING - (click the hamburger Icon on the navbar for navigation); please welcome the user with @${user.username} to "GoneChatting" and tell the slogan, "slogan: where you will never catch a catfish".  let them know this is the hottest new app on the block and to tell their momma and their freinds (something like that), and inform them of some of the features of the app and how it works-(ie the navigation- send likes, send video messages, wait on the speed dating page for users), let them know it is new and we are tired of all the filters on pictures that people use in other dating apps, that is why here at Gone Chatting we only do Live Video Calls and Video Messages exclusively to communicate! Then ask them a random personal question.`;
        try {
          const responseAI = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Correct model name for the OpenAI AP
            messages: [{ role: "system", content: prompt }],
            temperature: 1,
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
            { _id: roomId },
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
        } catch (err) {
          console.log("error making AI response: ", err);
        }
      }

      const getAllRooms = await Room.find({}).populate("users");

      publishRoomCreatedOrUpdated(getAllRooms);

      return currentRoom;
    } catch (err) {
      throw new AuthenticationError(err);
    }
  },
};
