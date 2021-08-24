import classes from "./ChatBottom.module.css";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add_to_messages } from "../../../state/actions/chat";
function ChatBottom() {
  const socketReducer = useSelector((state) => state.socketReducer);
  const chatReducer = useSelector((state) => state.chatReducer);
  const [Message, setMessage] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    socketReducer.socket.on("messageSent", (data) => {
      console.log(
        "Message Sent",
        data,
        chatReducer.currentChatId,
        chatReducer.currentChatName
      );
      if (chatReducer.currentChatId == data.receiver) {
        dispatch(add_to_messages(data));
      }
    });
    return () => {
      socketReducer.socket.off("messageSent");
    };
  }, [chatReducer.currentChatId]);
  const sendMessage = () => {
    if (socketReducer.socket) {
      socketReducer.socket.emit("sendMessage", {
        message: Message,
        receiverId: chatReducer.currentChatId,
      });
    }
    setMessage("");
  };
  return (
    <div className={classes.ChatBottom}>
      <input
        type="text"
        value={Message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => sendMessage()}>Send</button>
    </div>
  );
}

export default ChatBottom;
