const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  chats: [
    {
      messagesWith: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      messages: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Message",
        },
      ],
      unread_count: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
