const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  messagesWith: {
    friend: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        message: {
          type: String,
          required: true,
        },
        sender: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        receiver: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        date: { type: Date, default: Date.now },
      },
    ],
  },
});

module.exports = mongoose.model("Chat", chatSchema);
