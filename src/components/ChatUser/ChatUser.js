import classes from "./ChatUser.module.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_messages } from "../../state/actions/chat";
function ChatUser({ user }) {
  console.log("load chat users");
  const dispatch = useDispatch();
  const socketReducer = useSelector((state) => state.socketReducer);
  const chatReducer = useSelector((state) => state.chatReducer);
  return (
    <div
      onClick={() =>
        dispatch(get_messages(user.messagesWith._id, socketReducer.socket))
      }
      className={classes.ChatUser}
    >
      <div>{user.messagesWith.name}</div>
      {user.unread_count > 0 && (
        <span className={classes.unread}>{user.unread_count}</span>
      )}
      {chatReducer.onlineUsers.includes(user.messagesWith._id) && (
        <div>online</div>
      )}
    </div>
  );
}

export default ChatUser;
