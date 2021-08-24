import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_notifications,
  get_unseen_notifications_count,
} from "../../state/actions/notification";

function Notification() {
  const notificationReducer = useSelector((state) => state.notificationReducer);
  const socketReducer = useSelector((state) => state.socketReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_notifications());
    return () => {
      dispatch(get_unseen_notifications_count());
    };
  }, []);
  const acceptRequest = (userId) => {
    console.log("accept request");
    socketReducer.socket.emit("acceptRequest", userId);
  };
  const ignoreRequest = (userId) => {
    console.log("ignore request");
    socketReducer.socket.emit("ignoreRequest", userId);
  };
  return (
    <div>
      <ul>
        {notificationReducer.notifications.map((notification) => {
          return (
            <li
              key={notification._id}
              style={{
                background: notification.seen ? "white" : "#333",
                color: notification.seen ? "black" : "white",
              }}
            >
              {notification.type == "accepted" ? (
                `${notification.user.name} accepted your friend request`
              ) : notification.type == "accept" ? (
                `You became friends with ${notification.user.name}`
              ) : notification.type == "request" &&
                notification.requestStatus == "completed" ? (
                `${notification.user.name} wants to follow you`
              ) : (
                <>
                  `${notification.user.name} wants to follow you`
                  <button onClick={() => acceptRequest(notification.user._id)}>
                    Accept
                  </button>
                  <button onClick={() => ignoreRequest(notification.user._id)}>
                    Ignore
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Notification;
