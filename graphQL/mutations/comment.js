const { AuthenticationError } = require("apollo-server");
const { User, Room, Comment } = require("../../models");
const { OpenAI } = require("openai");
const { publishCreateComment } = require("../subscription/subscription");
require("dotenv").config();

const openai = new OpenAI({
  organization: process.env.ORG,
  apiKey: process.env.OPEN_AI_KEY,
});

module.exports = {
  createCommentResolver: async (root, args, ctx) => {
    const { text, userId, roomId } = args;
    try {
      const comment = await new Comment({ text }).save();

      const room = await Room.findByIdAndUpdate(
        { _id: roomId },
        { $push: { comments: comment } },
        { new: true }
      )
        .populate("users")
        .populate("comments");

      const author = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { comments: comment } },
        { new: true }
      ).populate("pictures");

      const newComment = await Comment.findByIdAndUpdate(
        {
          _id: comment._id,
        },
        { author, room },
        { new: true }
      )
        .populate({
          path: "author",
          populate: [{ path: "pictures", model: "Picture" }],
        })
        .populate("room");

      publishCreateComment(newComment);

      if (room.users.length < 3) {
        let mainRoom = await Room.find({ _id: roomId }).populate({
          path: "comments",
          populate: [{ path: "author", model: "User" }],
        });

        const findHumanComments = async () => {
          let comments = [];

          await mainRoom[0].comments.map((comment) => {
            if (comment.author._id == userId) {
              comments.push(comment.text);
            }
          });

          return comments;
        };

        const findAIComments = async () => {
          let comments = [];
          await mainRoom[0].comments.forEach((comment) => {
            if (comment.author.username === "DatingHost") {
              comments.push(comment.text);
            }
          });

          return comments;
        };

        const humanComments = await findHumanComments();

        const AIcomments = await findAIComments();

        const createPrompt = async () => {
          try {
            const humanLastThree = await humanComments.slice(-4); // Get the last three human comments
            const AILastThree = AIcomments.slice(
              -(humanLastThree.length > 2 ? humanLastThree.length - 1 : 1)
            );
            let mostComment;

            mostComment =
              humanLastThree.length > AILastThree.length
                ? {
                    type: "Human: ",
                    comments: humanLastThree,
                    otherType: "AI: ",
                    otherComments: AILastThree,
                  }
                : {
                    type: "AI: ",
                    comments: AILastThree,
                    otherType: "Human: ",
                    otherComments: humanLastThree,
                  };

            let prompt = "";

            for (let i = 0; i < mostComment.comments.length; i++) {
              prompt += `\n${mostComment.type}${mostComment.comments[i]}`;

              if (mostComment.otherComments[i]) {
                prompt += `\n${mostComment.otherType}${mostComment.otherComments[i]}`;
              }
            }

            return prompt.trim();
          } catch (err) {
            console.log(err);
          }
        };

        const prompt = await createPrompt();

        const responseAI = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Correct model name for the OpenAI AP
          messages: [
            {
              role: "system",
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 3000,
          top_p: 1,
          frequency_penalty: 0.3,
          presence_penalty: 0.9,
          stop: [" Human:", " AI:"],
        });

        let newResponse = responseAI.choices[0].message.content;

        const commentAI = await new Comment({
          text: newResponse,
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
      }

      return newComment;
    } catch (err) {
      throw new AuthenticationError(err.message);
    }
  },

  createCommentSubscription: {
    subscribe: () => pubsub.asyncIterator(CREATE_COMMENT),
  },
};
