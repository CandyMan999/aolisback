const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      validate: (v) => v.length === 2,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// ensure pair uniqueness regardless of order
MatchSchema.pre("save", function (next) {
  this.users.sort();
  next();
});

MatchSchema.index({ "users.0": 1, "users.1": 1 }, { unique: true });
MatchSchema.index({ users: 1 });

module.exports = mongoose.model("Match", MatchSchema);
