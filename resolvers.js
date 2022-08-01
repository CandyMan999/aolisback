const { AuthenticationError, PubSub } = require("apollo-server");
const { OAuth2Client } = require("google-auth-library");
const { User, Picture, Room, Comment } = require("./models");
const { Configuration, OpenAIApi } = require("openai");

const bcrypt = require("bcrypt");
const moment = require("moment");
const cloudinary = require("cloudinary");
require("dotenv").config();

const { verifyToken, createToken } = require("./utils/middleware");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const pubsub = new PubSub();
const ROOM_CREATED_OR_UPDATED = "ROOM_CREATED_OR_UPDATED";
const CREATE_COMMENT = "CREATE_COMMENT";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    fetchMe: async (root, args, ctx) => {
      const { token } = args;

      try {
        const { id } = await verifyToken({ token });
        if (!id) {
          throw new AuthenticationError("Unathenticated off token: ", token);
        }

        const user = await User.findOneAndUpdate(
          { _id: id },
          { isLoggedIn: true },
          { new: true }
        )
          .populate("pictures")
          .populate("comments");
        if (!user) {
          return new AuthenticationError("Username Doesn't Exsist");
        }

        return user;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    getRooms: async (root, args, ctx) => {
      try {
        //need to figure out a way to populate pictures
        let rooms = await Room.find({}).populate("users").populate("comments");

        await Promise.all(
          rooms.map(async (room) => {
            const isAfterMin = moment(room.createdAt).isBefore(
              moment().subtract(30, "minutes")
            );

            await Room.findByIdAndUpdate(
              {
                _id: room._id,
              },
              { comments: room.comments.length ? room.comments : [] },
              { new: true }
            );

            if (!room.users.length && !!isAfterMin && room.name !== "Main") {
              await room.deleteOne({ _id: room._id });
            }
            room.users.map(async (user) => {
              const isAfterHour = moment(user.roomInfo.subscribedAt).isBefore(
                moment().subtract(2, "hours")
              );
              if (isAfterHour) {
                await Room.updateMany({ $pull: { users: user._id } });
                await User.updateOne(
                  { _id: user._id },
                  { $set: { comments: [], isLoggedIn: false } }
                );
              }
            });
          })
        );

        rooms = await Room.find({}).populate("users").populate("comments");

        return rooms;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    getComments: async (root, args, ctx) => {
      const { roomId } = args;

      try {
        const comments = await Comment.find({ room: roomId })
          .populate({
            path: "author",
            populate: [{ path: "pictures", model: "Picture" }],
          })
          .populate("room");

        return comments;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    findUser: async (root, args, ctx) => {
      const { _id } = args;
      try {
        const user = await User.findById({ _id }).populate("pictures");

        return user;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    getUsers: async (root, args, ctx) => {
      try {
        const users = await User.find({
          "location.lat": { $ne: null },
          isLoggedIn: true,
        })
          .populate("room")
          .populate("pictures");

        return users;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
  },
  Mutation: {
    googleSignup: async (root, args, ctx) => {
      const { username, idToken } = args;

      const verifyAuthToken = async (idToken) => {
        try {
          const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.OAUTH_CLIENT_ID,
          });
          return ticket.getPayload();
        } catch (err) {
          console.error(`Error verifying auth token`, err);
        }
      };

      const { email, name, picture } = await verifyAuthToken(idToken);

      const checkIfUserExists = async (email, username) => {
        const user = await User.findOne({ email });
        if (user) {
          throw new AuthenticationError("Google User Already Exists");
        } else {
          const user = await User.findOne({ username });
          if (user) {
            throw new AuthenticationError("Username Already Exists");
          }
        }
      };

      const validate = await checkIfUserExists(email, username);
      if (validate) {
        return;
      }

      const user = await new User({
        name,
        email,
        username,
        isLoggedIn: true,
      }).save();

      const newPhoto = await Picture.create({ url: picture, user: user._id });

      const currentUser = await User.findByIdAndUpdate(
        {
          _id: user._id,
        },
        { $push: { pictures: newPhoto } },
        { new: true }
      ).populate("pictures");

      const token = await createToken(currentUser._id);

      return { user: currentUser, token };
    },

    signup: async (root, args, ctx) => {
      try {
        const { username, password, email } = args;

        const checkIfUserExists = async (email, username) => {
          const user = await User.findOne({ email });
          if (user) {
            throw new AuthenticationError("Email Already Exists");
          } else {
            const user = await User.findOne({ username });
            if (user) {
              throw new AuthenticationError("Username Already Exists");
            }
          }
        };

        const validate = await checkIfUserExists(email, username);
        if (validate) {
          return;
        }

        const user = await new User({
          username,
          password,
          email,
          isLoggedIn: true,
        }).save();

        const token = await createToken(user._id);
        return { user: user, token };
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },

    login: async (root, args, ctx) => {
      const { username, password } = args;

      try {
        const user = await User.findOneAndUpdate(
          { username },
          { isLoggedIn: true },
          { new: true }
        )
          .populate("pictures")
          .populate("comments");
        if (!user) {
          return new AuthenticationError("Username Doesn't Exsist");
        }

        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = await createToken(user._id);

            return { user, token };
          } else {
            throw new AuthenticationError("Incorrect Password");
          }
        }
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },

    logout: async (root, args, ctx) => {
      const { username } = args;

      try {
        const user = await User.findOneAndUpdate(
          { username },
          { isLoggedIn: false },
          { new: true }
        );

        await Room.updateMany({ $pull: { users: user._id } });
        await User.updateOne(
          { _id: user._id },
          { $set: { comments: [], isLoggedIn: false } }
        );

        const getAllRooms = await Room.find({}).populate("users");

        pubsub.publish(ROOM_CREATED_OR_UPDATED, {
          roomCreatedOrUpdated: getAllRooms,
        });

        return user;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },

    googleLogin: async (root, args, ctx) => {
      const { idToken } = args;
      try {
        const verifyAuthToken = async (idToken) => {
          try {
            const ticket = await client.verifyIdToken({
              idToken,
              audience: process.env.OAUTH_CLIENT_ID,
            });

            return ticket.getPayload();
          } catch (err) {
            console.error(`Error verifying auth token`, err);
          }
        };

        const { email } = await verifyAuthToken(idToken);
        const user = await User.findOneAndUpdate(
          { email },
          { isLoggedIn: true },
          { new: true }
        )
          .populate("pictures")
          .populate("comments");

        const token = await createToken(user._id);

        return !!user
          ? { user, token }
          : new AuthenticationError("Google User Dosen't Exist");
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },

    createRoom: async (root, args, ctx) => {
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
            new: true,
          }
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

            if (!room.users.length && !!isAfterMin && room.name !== "Main") {
              await room.deleteOne({ _id: room._id });
            }
            room.users.map(async (user) => {
              const isAfterHour = moment(user.roomInfo.subscribedAt).isBefore(
                moment().subtract(2, "hours")
              );
              if (isAfterHour) {
                await Room.updateMany({ $pull: { users: user._id } });
                await User.updateOne(
                  { _id: user._id },
                  { $set: { comments: [], isLoggedIn: false } }
                );
              }
            });
          })
        );

        const getAllRooms = await Room.find().populate("users");

        pubsub.publish(ROOM_CREATED_OR_UPDATED, {
          roomCreatedOrUpdated: getAllRooms,
        });
        return currentRoom;
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },

    changeRoom: async (root, args, ctx) => {
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
            room,
            new: true,
          }
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

            if (!room.users.length && !!isAfterMin && room.name !== "Main") {
              await room.deleteOne({ _id: room._id });
            }

            return room.users.map(async (user) => {
              const isAfterHour = moment(user.roomInfo.subscribedAt).isBefore(
                moment().subtract(2, "hours")
              );
              if (isAfterHour) {
                await Room.updateMany({ $pull: { users: user._id } });
                await User.updateOne(
                  { _id: user._id },
                  { $set: { comments: [], isLoggedIn: false } }
                );
              }
            });
          })
        );

        const getAllRooms = await Room.find({}).populate("users");

        pubsub.publish(ROOM_CREATED_OR_UPDATED, {
          roomCreatedOrUpdated: getAllRooms,
        });

        if (room.name === "Main" && !room.comments.length) {
          const prompt = `Human: I just joined the main chat for this new app about sobriety, please welcome me to "ChatSober.com" ask me a random personal question about my sobriety and give me a random sobriety quote`;

          const responseAI = await openai.createCompletion({
            model: "text-davinci-002",
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
            { _id: "62c38477a2b49e4cbb75a8d3" },
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

          pubsub.publish(CREATE_COMMENT, {
            createComment: newCommentAI,
          });
        }

        return currentRoom;
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },
    createComment: async (root, args, ctx) => {
      const { text, userId, roomId } = args;
      try {
        const comment = await new Comment({ text }).save();

        const room = await Room.findByIdAndUpdate(
          { _id: roomId },
          { $push: { comments: comment } },
          { new: true }
        );

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

        pubsub.publish(CREATE_COMMENT, {
          createComment: newComment,
        });

        if (room.users.length === 1 && room.name === "Main") {
          let mainRoom = await Room.find({ name: "Main" }).populate({
            path: "comments",
            populate: [{ path: "author", model: "User" }],
          });

          const findHumanComments = async () => {
            let comments = [];
            await mainRoom[0].comments.forEach((comment) => {
              if (comment.author._id == userId) {
                comments.push(comment.text);
              }
            });

            return comments;
          };

          const findAIComments = async () => {
            let comments = [];
            await mainRoom[0].comments.forEach((comment) => {
              if (comment.author.username === "J_Money$") {
                comments.push(comment.text);
              }
            });

            return comments;
          };

          const humanComments = await findHumanComments();

          const AIcomments = await findAIComments();

          const createPrompt = () => {
            let prompt = "";
            for (let i = 0; i < humanComments.length; i++) {
              prompt += AIcomments[i]
                ? `Human: ${humanComments[i]}\nAI:\n${AIcomments[i]}\n`
                : i === 0
                ? `Human: ${humanComments[i]}`
                : `\nHuman: ${humanComments[i]}`;
            }
            return prompt;
          };

          const prompt = await createPrompt();

          const responseAI = await openai.createCompletion({
            model: "text-davinci-002",
            prompt,
            temperature: 0.9,
            max_tokens: 150,
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
            { _id: "62c38477a2b49e4cbb75a8d3" },
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

          pubsub.publish(CREATE_COMMENT, {
            createComment: newCommentAI,
          });
        }

        return newComment;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    createProfile: async (root, args, ctx) => {
      const {
        intro,
        age,
        sex,
        occupation,
        sobrietyTime,
        sponsor,
        sponsee,
        kids,
        _id,
      } = args;
      try {
        const profile = await User.findByIdAndUpdate(
          { _id },
          { intro, age, sex, occupation, sobrietyTime, sponsor, sponsee, kids },
          { new: true }
        ).populate("pictures");

        return profile;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    updateLocation: async (root, args, ctx) => {
      const { lat, lng, _id } = args;

      try {
        const user = await User.findByIdAndUpdate(
          { _id },
          { location: { lat, lng } },
          { new: true }
        ).populate("pictures");

        return user;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    addPhoto: async (root, args, ctx) => {
      const { _id, url, publicId } = args;
      try {
        const picture = await Picture.create({ url, publicId });
        const user = await User.findByIdAndUpdate(
          { _id },
          { $push: { pictures: picture } },
          { new: true }
        ).populate("pictures");
        await Picture.findByIdAndUpdate(
          { _id: picture._id },
          { user },
          { new: true }
        );

        return user;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
    deletePhoto: async (root, args, ctx) => {
      const { photoId, userId } = args;

      try {
        const { publicId } = await Picture.findById(photoId);

        if (publicId) {
          const deleteData = await cloudinary.uploader.destroy(publicId);
        }

        await Picture.deleteOne({ _id: photoId });
        const user = await User.findByIdAndUpdate(
          { _id: userId },
          { $pull: { pictures: photoId } },
          { new: true }
        )
          .populate("pictures")
          .populate("comments");
        return user;
      } catch (err) {
        throw new AuthenticationError(err.message);
      }
    },
  },
  Subscription: {
    roomCreatedOrUpdated: {
      subscribe: () => pubsub.asyncIterator(ROOM_CREATED_OR_UPDATED),
    },
    createComment: {
      subscribe: () => pubsub.asyncIterator(CREATE_COMMENT),
    },
  },
};
