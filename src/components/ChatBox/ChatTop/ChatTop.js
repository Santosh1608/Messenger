import classes from "./ChatTop.module.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function ChatTop() {
  const chatReducer = useSelector((state) => state.chatReducer);
  return <div className={classes.ChatTop}>{chatReducer.currentChatName}</div>;
}

export default ChatTop;
