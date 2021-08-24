const Chat = require("../models/Chat");
const Message = require("../models/Message");
const sendMessage = async (receiverId, userId, message) => {
  try {
    const newMessageForSender = new Message({
      message,
      sender: userId,
      receiver: receiverId,
      seen: false,
    });
    await newMessageForSender.save();
    const newMessageForReceiver = new Message({
      message,
      sender: userId,
      receiver: receiverId,
      seen: true,
    });
    await newMessageForReceiver.save();
    const userChat = await Chat.findOne({ user: userId });
    const userChatIndex = userChat.chats.findIndex(
      (chat) => chat.messagesWith.toString() == receiverId
    );
    userChat.chats[userChatIndex].messages.push(newMessageForSender);
    await userChat.save();

    const receiverChat = await Chat.findOne({ user: receiverId });

    const receiverChatIndex = receiverChat.chats.findIndex(
      (chat) => chat.messagesWith.toString() == userId
    );
    receiverChat.chats[receiverChatIndex].messages.push(newMessageForReceiver);
    receiverChat.chats[receiverChatIndex].unread_count =
      receiverChat.chats[receiverChatIndex].unread_count + 1;
    await receiverChat.save();
    return {
      data: {
        receiverMessage: newMessageForReceiver,
        senderMessage: newMessageForSender,
      },
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "error sending message",
      data: null,
    };
  }
};

const setSeen = async (receiverId, userId) => {
  try {
    console.log("Set seen");
    const receiverChat = await Chat.findOne({ user: receiverId });
    const userChat = await Chat.findOne({ user: userId });
    const receiverChatIndex = receiverChat.chats.findIndex(
      (chat) => chat.messagesWith.toString() == userId
    );
    const userChatIndex = userChat.chats.findIndex(
      (chat) => chat.messagesWith.toString() == receiverId
    );
    userChat.chats[userChatIndex].unread_count = 0;
    await userChat.save();
    console.log("RECEIVER ID", receiverId, "USER ID", userId);
    const receiverMessages = receiverChat.chats[receiverChatIndex].messages;
    const messages = await Message.updateMany(
      {
        _id: { $in: receiverMessages },
        seen: false,
      },
      { $set: { seen: true } }
    );
    console.log("updated seen messages", messages);
    return {
      data: messages,
      error: null,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendMessage,
  setSeen,
};
