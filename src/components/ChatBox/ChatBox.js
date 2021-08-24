import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_seen } from "../../state/actions/chat";
import ChatTop from "./ChatTop/ChatTop";
import ChatMiddle from "./ChatMiddle/ChatMiddle";
import ChatBottom from "./ChatBottom/ChatBottom";
import classes from "./ChatBox.module.css";
function ChatBox() {
  const dispatch = useDispatch();
  const chatReducer = useSelector((state) => state.chatReducer);
  const socketReducer = useSelector((state) => state.socketReducer);
  useEffect(() => {
    if (socketReducer.socket) {
      console.log("setting chat socket reducer");
      socketReducer.socket.on("receiveSeen", (receiverId) => {
        console.log("receive Seen", receiverId, chatReducer.currentChatId);
        if (receiverId == chatReducer.currentChatId) {
          dispatch(set_seen());
        }
      });
    }
    return () => {
      if (socketReducer.socket) socketReducer.socket.off("receiveSeen");
    };
  }, [socketReducer.socket, chatReducer.currentChatId]);
  return chatReducer.currentChatId ? (
    <div className={classes.ChatBox}>
      <ChatTop />
      <ChatMiddle />
      <ChatBottom />
    </div>
  ) : (
    <div>Open conversation to start chat</div>
  );
}

export default ChatBox;
