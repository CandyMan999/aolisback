const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  lookingFor: {
    ageRange: {
      lowEnd: {
        type: Number,
        default: 18,
      },
      highEnd: {
        type: Number,
        default: 80,
      },
    },
    kids: {
      type: String,
      default: "",
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Gender_Diverse"],
    },
  },
  roomInfo: {
    subscribedAt: {
      type: Date,
      default: null,
    },
    roomId: {
      type: String,
      default: "",
    },
  },
  intro: {
    type: String,
    default: "",
  },

  age: {
    type: Number,
    default: null,
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Gender_Diverse"],
  },
  pictures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Picture",
    },
  ],
  occupation: {
    type: String,
    default: "",
  },
  singleTime: {
    type: Date,
    default: null,
  },
  drink: {
    type: String,
    enum: ["Yes", "Socially", "Never"],
  },
  smoke: {
    type: String,
    enum: ["Yes", "Socially", "Never"],
  },
  marijuana: {
    type: String,
    enum: ["Friendly", "Unfriendly"],
  },
  kids: {
    type: String,
    default: "",
  },
  drugs: {
    type: String,
    enum: ["Yes", "No", "Recreational"],
  },
  location: {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  blockedUsers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
  },
  sentVideos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Video",
    },
  ],
  receivedVideos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Video",
    },
  ],
  chatRequest: {
    type: mongoose.Schema.ObjectId,
    ref: "ChatRequest",
  },
});

UserSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
