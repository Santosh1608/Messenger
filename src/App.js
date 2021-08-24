import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Form/Login/Login";
import SignUp from "./pages/Form//Signup/Signup";
import Chat from "./pages/Chat/Chat";
import Navbar from "./components/Navbar/Navbar";
import Notification from "./pages/Notification/Notification";
import NotificationModal from "./components/NotificationModal/NotificationModal";
import Profile from "./pages/Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  get_notifications,
  get_unseen_notifications_count,
} from "./state/actions/notification";
import {
  get_chat,
  add_to_messages,
  increase_unread_count,
  set_online,
} from "./state/actions/chat";
import NotificationSound from "./assets/music/notification.mp3";
import InMessageSound from "./assets/music/inmessage.mp3";
import messageNotificationSound from "./assets/music/message.mp3";
function App() {
  const [Modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.authReducer);
  const socketReducer = useSelector((state) => state.socketReducer);
  const chatReducer = useSelector((state) => state.chatReducer);
  const NotificationReceiver = () => {
    dispatch(get_chat());
    Modal
      ? dispatch(get_notifications(5))
      : window.location.pathname == "/notifications"
      ? dispatch(get_notifications())
      : dispatch(get_unseen_notifications_count());
    new Audio(NotificationSound).play();
  };

  const MessageReceiver = (data) => {
    if (chatReducer.currentChatId == data.sender) {
      dispatch(add_to_messages(data));
      new Audio(InMessageSound).play();
      socketReducer.socket.emit("setSeen", data.sender);
    } else {
      //TODO: INCREASE UN_READ COUNT AND TOTAL_UNREAD_COUNT
      dispatch(increase_unread_count(data.sender));
      new Audio(messageNotificationSound).play();
    }
  };
  useEffect(() => {
    // SOCKET CONNECTION
    if (authReducer.token) {
      const socket = io(`http://localhost:8000`, {
        query: { token: localStorage.getItem("token") },
      });
      socket.on("connect", () => {
        console.log("connected");
        dispatch({ type: "SET_SOCKET", payload: socket });
      });
      socket.on("disconnect", (reason) => {
        console.log("disconnected");
        if (reason === "io server disconnect") {
          console.log("disconnected by server");
          socket.connect();
        }
        dispatch({ type: "SET_SOCKET", payload: null });
      });
      socket.on("connect_error", (s) => {
        console.log("connection error");
        dispatch({ type: "SET_SOCKET", payload: null });
        socket.connect();
      });
      socket.on("online", (users) => {
        console.log("ONLINE USERS");
        console.log(users);
        dispatch(set_online(users));
      });
    }
  }, [authReducer.token]);

  useEffect(() => {
    // NotificationReceived
    if (socketReducer.socket) {
      socketReducer.socket.on("NotificationReceived", NotificationReceiver);
      return () => {
        socketReducer.socket.off("NotificationReceived", NotificationReceiver);
      };
    }
  }, [Modal, socketReducer.socket]);

  useEffect(() => {
    // MessageReceived
    if (socketReducer.socket) {
      socketReducer.socket.on("messageReceived", MessageReceiver);
      return () => {
        socketReducer.socket.off("messageReceived", MessageReceiver);
      };
    }
  }, [socketReducer.socket, chatReducer.currentChatId]);

  useEffect(() => {
    // GET NOTIFICATIONS AND LOAD CHAT
    if (authReducer.token) {
      dispatch(get_unseen_notifications_count());
      dispatch(get_chat());
    }
  }, [authReducer.token]);
  const privateRoutes = (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/user/:id">
        <Profile />
      </Route>
      <Route path="/notifications">
        <Notification />
      </Route>
      <Route path="/chat">
        <Chat />
      </Route>
      <Redirect to="/home" />
    </Switch>
  );
  const publicRoutes = (
    <Switch>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );

  return authReducer.token ? (
    <>
      {Modal && <NotificationModal setModal={setModal} />}
      <Navbar setModal={setModal} />
      {privateRoutes}
    </>
  ) : (
    publicRoutes
  );
}

export default App;
