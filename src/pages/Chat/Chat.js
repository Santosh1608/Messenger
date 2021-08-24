import classes from "./Chat.module.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatUser from "../../components/ChatUser/ChatUser";
import ChatBox from "../../components/ChatBox/ChatBox";
import { remove_current_chat_id } from "../../state/actions/chat";
function Chat() {
  const chatReducer = useSelector((state) => state.chatReducer);
  const dispatch = useDispatch();
  console.log(chatReducer.chat);
  useEffect(() => {
    return () => {
      dispatch(remove_current_chat_id());
    };
  }, []);
  return (
    <div className={classes.WrapChat}>
      <div className={classes.ChatUsers}>
        {chatReducer.chat.map((chat) => (
          <ChatUser key={chat._id} user={chat} />
        ))}
      </div>
      <div className={classes.ChatBox}>
        <ChatBox />
      </div>
    </div>
  );
}

export default Chat;
