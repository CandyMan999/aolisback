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
  participantLeft: { type: Boolean, default: false },
  offer: { type: String }, // SDP offer string
  answer: { type: String }, // SDP answer string
  candidates: [{ type: String }], // ICE candidate strings
});

module.exports = mongoose.model("ChatRequest", ChatRequestSchema);
