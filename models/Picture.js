const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  url: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  publicId: { type: String },
  flagged: { type: Boolean, default: false },
  provider: {
    type: String,
    enum: ["Cloudinary", "Cloudflare"],
    default: "Cloudflare",
  },
  oldUrl: { type: String },
  oldPublicId: { type: String },
  migratedFrom: { type: String, enum: ["Cloudinary", "Cloudflare"] },
  migratedAt: { type: Date },
});

module.exports = mongoose.model("Picture", PictureSchema);
