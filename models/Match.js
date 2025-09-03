const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

MatchSchema.pre("save", function(next) {
  this.users.sort();
  next();
});

// Ensure unique pair regardless of order
MatchSchema.index(
  { users: 1 },
  { unique: true }
);

module.exports = mongoose.model("Match", MatchSchema);
