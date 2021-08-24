const router = require("express").Router();
const Chat = require("../models/Chat");
const { isSignedIn } = require("../middleware/auth");
router.get("/chat/loadChat", isSignedIn, async (req, res) => {
  try {
    const { chats } = await Chat.findOne({ user: req.user._id }).populate(
      "chats.messagesWith",
      "name"
    );
    res.send(chats);
  } catch (error) {
    res.status(400).send({
      error: "Cannot load chat",
    });
  }
});

router.get("/chat/loadMessages/:receiverId", isSignedIn, async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const userChat = await Chat.findOne({ user: req.user._id }).populate(
      "chats.messages"
    );
    console.log(userChat);
    const userChatIndex = userChat.chats.findIndex(
      (chat) => chat.messagesWith.toString() == receiverId
    );
    const previousUnreadCount = userChat.chats[userChatIndex].unread_count;
    userChat.chats[userChatIndex].unread_count = 0;
    await userChat.save();
    res.send({ chat: userChat.chats[userChatIndex], previousUnreadCount });
  } catch (error) {
    res.status(400).send({
      error: "cannot load messages",
    });
  }
});

module.exports = router;
