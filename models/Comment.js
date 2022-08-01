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

// CommentSchema.pre("remove", { document: true, query: false }, function (next) {
//   // Remove all the assignment docs that reference the removed person.
//   this.model("Room").remove({ comment: this._id }, next);
// });

// CommentSchema.pre("deleteMany", function (next) {
//   try {
//     console.log("ID of TTL delete: ", this._id);
//     Room.updateMany(
//       {},
//       { $pull: { comments: this._id } },
//       { multi: true },
//       next
//     );
//     return next;
//   } catch (err) {
//     console.log("error TTL: ", err);
//     return next;
//   }
// });

// CommentSchema.post("save", function (next) {
//   try {
//     console.log("firing: ", this._id);
//     setTimeout(() => {
//       console.log("firing: update room");
//       Room.updateMany({}, { $pull: { comments: this._id } }, { multi: true });
//     }, 60);

//     return next;
//   } catch (err) {
//     console.log("error TTL: ", err);
//     return next;
//   }
// });

module.exports = mongoose.model("Comment", CommentSchema);
