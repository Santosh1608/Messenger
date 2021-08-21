import React from "react";
import bell from "./icons/bell.svg";
import chat from "./icons/chat.svg";
import classes from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
  const dispatch = useDispatch();
  const socketReducer = useSelector((state) => state.socketReducer);
  return (
    <nav>
      <div>
        <img src={bell} />
        <img src={chat} />
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
