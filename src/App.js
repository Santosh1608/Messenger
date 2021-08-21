import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Form/Login/Login";
import SignUp from "./pages/Form//Signup/Signup";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile/Profile";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";

function App() {
  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.authReducer);

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
          // the disconnection was initiated by the server, you need to reconnect manually
          console.log("disconnected by server");
          //TODO: socket.connect();
        }
        dispatch({ type: "SET_SOCKET", payload: null });
        // else the socket will automatically try to reconnect
      });
      // either by directly modifying the `auth` attribute
      socket.on("connect_error", (s) => {
        console.log("connection error");
        //TODO: socket.connect();
        dispatch({ type: "SET_SOCKET", payload: null });
        socket.connect();
      });
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
      <Navbar />
      {privateRoutes}
    </>
  ) : (
    publicRoutes
  );
}

export default App;
