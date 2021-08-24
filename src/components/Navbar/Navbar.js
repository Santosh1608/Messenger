import React from "react";
import bell from "./icons/bell.svg";
import chat from "./icons/chat.svg";
import classes from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
function Navbar({ setModal }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const socketReducer = useSelector((state) => state.socketReducer);
  const notificationReducer = useSelector((state) => state.notificationReducer);
  const chatReducer = useSelector((state) => state.chatReducer);
  return (
    <nav>
      <div>
        <div className={classes.Bell}>
          <img src={bell} onClick={() => setModal(true)} />
          {notificationReducer.unseen > 0 && (
            <div className={classes.unseen}>{notificationReducer.unseen}</div>
          )}
        </div>

        <div className={classes.Bell}>
          <img
            src={chat}
            onClick={() => {
              setModal(false);
              history.push("/chat");
            }}
          />
          {chatReducer.totalUnreadCount > 0 && (
            <div className={classes.unseen}>{chatReducer.totalUnreadCount}</div>
          )}
        </div>
        <span
          onClick={() => {
            dispatch({ type: "LOGOUT" });
            socketReducer.socket.disconnect();
          }}
        >
          LOGOUT
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
