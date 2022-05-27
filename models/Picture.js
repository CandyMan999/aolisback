const mongoose = require("mongoose");

const PictureSchema = new mongoose.Schema({
  url: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  publicId: { type: String },
});

module.exports = mongoose.model("Picture", PictureSchema);
