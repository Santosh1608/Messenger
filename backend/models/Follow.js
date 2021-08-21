const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    friends: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    pending: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    requests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Follow", followSchema);
