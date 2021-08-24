const initialState = {
  chat: [],
  onlineUsers: [],
  totalUnreadCount: 0,
  currentChatId: null,
  currentChatName: "",
  messages: [],
};
const chatReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "GET_CHAT":
      return {
        ...state,
        chat: payload,
        totalUnreadCount: payload
          .map((chat) => chat.unread_count)
          .reduce((total, unread) => total + unread),
      };
    case "GET_MESSAGES":
      console.log("GET MESSAGES", payload);
      const chat = [...state.chat];
      const chatIndex = state.chat.findIndex(
        (chat) => chat.messagesWith._id == payload.chat.messagesWith
      );
      const singleChat = { ...chat[chatIndex] };
      singleChat.unread_count = 0;
      chat[chatIndex] = singleChat;
      console.log(chat);
      return {
        ...state,
        chat,
        messages: payload.chat.messages,
        currentChatId: payload.chat.messagesWith,
        currentChatName: chat[chatIndex].messagesWith.name,
        totalUnreadCount:
          state.totalUnreadCount - parseInt(payload.previousUnreadCount),
      };
    case "ADD_TO_MESSAGES":
      const Messages = [...state.messages];
      Messages.push(payload);
      return {
        ...state,
        messages: Messages,
      };
    case "REMOVE CURRENT_CHAT_ID":
      console.log("REMOVE CURRENT CHAT ID");
      return {
        ...state,
        currentChatName: "",
        currentChatId: null,
      };
    case "INCREASE_UNREAD_COUNT":
      const chats = [...state.chat];
      const chatsIndex = state.chat.findIndex(
        (chat) => chat.messagesWith._id == payload
      );
      const oneChat = { ...chats[chatsIndex] };
      oneChat.unread_count = oneChat.unread_count + 1;
      chats[chatsIndex] = oneChat;
      return {
        ...state,
        chat: chats,
        totalUnreadCount: state.totalUnreadCount + 1,
      };
    case "SET_SEEN":
      console.log("set seen");
      let messages = [...state.messages];
      messages = messages.map((message) => {
        if (message.seen == false) {
          message.seen = true;
        }
        return message;
      });
      return {
        ...state,
        messages,
      };
    case "SET_ONLINE":
      console.log("SET ONLINE", payload);
      return {
        ...state,
        onlineUsers: payload,
      };

    default:
      return state;
  }
};

export default chatReducer;
