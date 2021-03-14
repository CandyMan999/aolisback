const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  users: [
    {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Room", RoomSchema);
