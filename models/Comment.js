const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    //change this back to 3700 after a lot of users
    // was 14800
    expires: 14800,
    default: Date.now,
  },
  author: { type: mongoose.Schema.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.ObjectId, ref: "Room" },
});

module.exports = mongoose.model("Comment", CommentSchema);
