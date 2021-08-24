import React, { useRef, useEffect } from "react";
import Message from "./Message/Message";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ChatMiddle.module.css";

function ChatMiddle() {
  const chatReducer = useSelector((state) => state.chatReducer);
  const authReducer = useSelector((state) => state.authReducer);
  const messageRef = useRef(null);
  useEffect(() => {
    console.log(messageRef.current);
    if (messageRef.current) {
      messageRef.current.scrollIntoView();
    }
  }, [chatReducer.currentChatId]);
  useEffect(() => {
    console.log(messageRef.current);
    if (
      messageRef.current &&
      chatReducer.messages[chatReducer.messages.length - 1].sender ==
        authReducer.user._id
    ) {
      messageRef.current.scrollIntoView();
    }
  }, [chatReducer.messages]);
  return (
    <div className={classes.ChatMiddle}>
      {chatReducer.messages.map((message) => (
        <Message
          own={message.sender == authReducer.user._id}
          message={message}
          key={message._id}
          setRef={messageRef}
        />
      ))}
    </div>
  );
}

export default ChatMiddle;
