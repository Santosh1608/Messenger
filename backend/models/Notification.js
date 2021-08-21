const mongoose = require("mongoose");
const uuid = require("node-uuid");
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  notifications: [
    {
      _id: {
        type: String,
        default: uuid.v4,
      },
      type: {
        type: String,
        enum: ["accept", "request", "accepted"],
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      requestStatus: {
        type: String,
        enum: ["pending,completed"],
      },
      seen: {
        type: Boolean,
        default: false,
      },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Notification", notificationSchema);
