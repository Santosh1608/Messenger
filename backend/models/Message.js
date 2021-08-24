const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
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
  seen: {
    type: Boolean,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
