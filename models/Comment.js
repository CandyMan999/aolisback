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
    expires: 100,
    default: Date.now,
  },
  author: { type: mongoose.Schema.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.ObjectId, ref: "Room" },
});

CommentSchema.pre("remove", function (next) {
  // Remove all the assignment docs that reference the removed person.
  this.model("Assignment").remove({ comment: this._id }, next);
});

module.exports = mongoose.model("Comment", CommentSchema);
