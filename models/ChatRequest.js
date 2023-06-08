const mongoose = require("mongoose");

const ChatRequestSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3700,
  },

  status: {
    type: String,
    enum: ["Pending", "Accept", "Decline", "Block", "Cancel"],
  },
  sender: { type: mongoose.Schema.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.ObjectId, ref: "User" },
});

module.exports = mongoose.model("ChatRequest", ChatRequestSchema);
