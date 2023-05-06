const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  url: { type: String },
  sender: { type: mongoose.Schema.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.ObjectId, ref: "User" },
  publicId: { type: String },
});

module.exports = mongoose.model("Video", VideoSchema);
