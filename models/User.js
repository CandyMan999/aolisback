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
    enum: ["male", "female"],
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
  sobrietyTime: {
    type: Date,
    default: null,
  },
  sponsor: {
    type: Boolean,
    default: false,
  },
  sponsee: {
    type: Boolean,
    default: false,
  },
  // drink: {
  //   type: String,
  //   enum: ["yes", "socially", "never"],
  // },
  // smoke: {
  //   type: String,
  //   enum: ["yes", "socially", "never"],
  // },
  // marijuana: {
  //   type: String,
  //   enum: ["friendly", "unfriendly"],
  // },
  kids: {
    type: Boolean,
    default: false,
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
      type: String,
      default: null,
    },
  ],
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
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
