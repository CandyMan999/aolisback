const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3700,
    default: Date.now,
  },
  author: { type: mongoose.Schema.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.ObjectId, ref: "Room" },
});

module.exports = mongoose.model("Comment", CommentSchema);
