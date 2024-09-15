const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  sex: {
    type: String,
    enum: ["Male", "Female", "Gender_Diverse"],
    required: true,
  },
  lookingFor: {
    type: String,
    enum: ["Male", "Female", "Gender_Diverse"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Waiting", "Deciding", "Connected", "Cancel", "Accept"],
    default: "Waiting",
  },
  pairedUser: { type: mongoose.Schema.ObjectId, ref: "User" },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // Default coordinates if not specified
      index: "2dsphere", // Specify the index type as 2dsphere for geospatial indexing
    },
    showOnMap: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3700,
  },
});

// Create the geospatial index on the 'location' field
QueueSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Queue", QueueSchema);
