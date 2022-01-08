const { AuthenticationError, PubSub } = require("apollo-server");
const { OAuth2Client } = require("google-auth-library");
const { User, Picture, Room, Comment } = require("./models");
const faker = require("faker");
const bcrypt = require("bcrypt");
const moment = require("moment");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const pubsub = new PubSub();
const ROOM_CREATED_OR_UPDATED = "ROOM_CREATED_OR_UPDATED";
const CREATE_COMMENT = "CREATE_COMMENT";

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getRooms: async (root, args, ctx) => {
      try {
        //need to figure out a way to populate pictures
        const rooms = await Room.find({})
          .populate("users")
          .populate("comments");

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

      return currentUser;
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

        console.log("new User: ", user);
        const newPhoto = await Picture.create({
          url: faker.image.people(),
          user: user._id,
        });

        const currentUser = await User.findByIdAndUpdate(
          {
            _id: user._id,
          },
          { $push: { pictures: newPhoto } },
          { new: true }
        ).populate("pictures");

        return currentUser;
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
            return user;
          } else {
            throw new AuthenticationError("Incorrect Password");
          }
        }
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

        return user
          ? user
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

            if (!room.users.length && !!isAfterMin) {
              await room.deleteOne({ _id: room._id });
            }
            // room.users.map(async (user) => {
            //   const isAfterHour = moment(user.roomInfo.subscribedAt).isBefore(
            //     moment().subtract(2, "hours")
            //   );
            //   if (isAfterHour) {
            //     await Room.updateMany({ $pull: { users: user._id } });
            //     await User.updateOne(
            //       { _id: user._id },
            //       { $set: { comments: [], isLoggedIn: false } }
            //     );
            //   }
            // });
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

            if (!room.users.length && !!isAfterMin) {
              await room.deleteOne({ _id: room._id });
            }

            // return room.users.map(async (user) => {
            //   const isAfterHour = moment(user.roomInfo.subscribedAt).isBefore(
            //     moment().subtract(2, "hours")
            //   );
            //   if (isAfterHour) {
            //     await Room.updateMany({ $pull: { users: user._id } });
            //     await User.updateOne(
            //       { _id: user._id },
            //       { $set: { comments: [], isLoggedIn: false } }
            //     );
            //   }
            // });
          })
        );

        const getAllRooms = await Room.find({}).populate("users");

        pubsub.publish(ROOM_CREATED_OR_UPDATED, {
          roomCreatedOrUpdated: getAllRooms,
        });

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
          { $push: { author, room } },
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
      const { _id, url } = args;
      try {
        const picture = await Picture.create({ url });
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
