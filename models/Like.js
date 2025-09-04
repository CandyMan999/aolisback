const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    liked: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

LikeSchema.index({ user: 1, liked: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
