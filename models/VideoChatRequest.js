const mongoose = require("mongoose");

const VideoChatRequestSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "accept", "decline", "block"],
  },
  sender: { type: mongoose.Schema.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.ObjectId, ref: "User" },
});

module.exports = mongoose.model("VideoChatRequest", VideoChatRequestSchema);
