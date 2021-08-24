import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_user } from "../../state/actions/user";
import classes from "./Profile.module.css";
function Profile() {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const socketReducer = useSelector((state) => state.socketReducer);
  const { user } = useSelector((state) => state.authReducer);
  const { id } = useParams();
  useEffect(() => {
    dispatch(get_user(id));
  }, []);
  const isfriend = userReducer.user?.friends.includes(user._id);
  const requested = userReducer.user?.pending.includes(user._id);
  const pending = userReducer.user?.requests.includes(user._id);

  const sendRequest = () => {
    console.log("send request", socketReducer.socket);
    socketReducer.socket.emit("followRequest", userReducer.user.user._id);
    socketReducer.socket.on("followRequestSent", () => {
      console.log("-----request sent------------");
      dispatch({ type: "MODIFY_USER_REQUESTS", payload: user._id });
    });
  };

  const acceptRequest = () => {
    console.log("accept request");
    socketReducer.socket.emit("acceptRequest", userReducer.user.user._id);
    socketReducer.socket.on("acceptRequestSent", () => {
      console.log("-----accept request sent------------");
      dispatch({ type: "MODIFY_USER_FRIENDS", payload: user._id });
    });
  };
  const ignoreRequest = () => {
    console.log("ignore request");
    socketReducer.socket.emit("ignoreRequest", userReducer.user.user._id);
    socketReducer.socket.on("ignoreRequestSent", () => {
      console.log("-----ignore request sent------------");
      dispatch({ type: "MODIFY_USER_PENDING", payload: user._id });
    });
  };
  return (
    <div className={classes.Profile}>
      <p>NAME: {userReducer.user?.user.name}</p>
      <p>EMAIL: {userReducer.user?.user.email}</p>
      <div className={classes.buttons}>
        <button disabled={!isfriend}>Message</button>
        {isfriend ? (
          <button>Friends</button>
        ) : pending ? (
          <button>Pending</button>
        ) : requested ? (
          <>
            {/* TODO: REMOVE USER FROM PENDING AND ADD TO FRIENDS */}
            <button onClick={acceptRequest}>Accept</button>

            <button onClick={ignoreRequest}>Ignore</button>
          </>
        ) : (
          <button onClick={sendRequest}>Follow</button>
        )}
      </div>
    </div>
  );
}

export default Profile;
