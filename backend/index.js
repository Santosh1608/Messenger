const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("./connectDb");
const app = express();
app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const {
  addUser,
  removeUser,
  findConnectedUser,
} = require("./socketActions/roomActions");
const {
  followRequest,
  acceptRequest,
  ignoreRequest,
} = require("./socketActions/followActions");
const { sendMessage, setSeen } = require("./socketActions/messageActions");
app.use(express.json());
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const notificationRoutes = require("./routes/notification");
const chatRoutes = require("./routes/chat");
app.use("/api", authRoutes);
app.use("/api/", notificationRoutes);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);

// SOCKET STUFF
io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.SECRET,
      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.user = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  // -----------------initialize socketId and userId------------
  const socketId = socket.id;
  const userId = socket.user._id;
  const users = addUser(userId, socketId);
  io.emit("online", {
    users,
  });

  // -------------FOLLOW REQUEST EVENT-------------------------
  socket.on("followRequest", async (followUserId) => {
    console.log("request user", followUserId);
    const { error, data } = await followRequest(followUserId, userId);
    if (!error) {
      console.log(data);
      socket.emit("followRequestSent");
      const receiverSocket = findConnectedUser(followUserId);
      if (receiverSocket) {
        socket.to(receiverSocket.socketId).emit("NotificationReceived");
      }
    } else {
      console.log(error);
      socket.emit("followRequestError");
    }
  });

  // ------------ACCEPT REQUEST EVENT----------------------------
  socket.on("acceptRequest", async (requestedUserId) => {
    const { error, data } = await acceptRequest(requestedUserId, userId);
    console.log(data, error);

    if (!error) {
      socket.emit("NotificationReceived");
      socket.emit("acceptRequestSent");
      console.log("SEND NOTIFICATION TO OTHER USER");
      const receiverSocket = findConnectedUser(requestedUserId);
      if (receiverSocket) {
        socket.to(receiverSocket.socketId).emit("NotificationReceived");
      }
    } else {
      socket.emit("acceptRequestError");
    }
  });

  // ------------IGNORE REQUEST EVENT----------------------------
  socket.on("ignoreRequest", async (requestedUserId) => {
    const { error, data } = await ignoreRequest(requestedUserId, userId);
    console.log(error, data);
    if (!error) {
      socket.emit("NotificationReceived");
      socket.emit("ignoreRequestSent");
    } else {
      socket.emit("ignoreRequestError");
    }
  });

  // -----------SEND MESSAGE EVENT-----------------------------------
  socket.on("sendMessage", async ({ message, receiverId }) => {
    console.log("sendMessage", message, receiverId);
    const { error, data } = await sendMessage(receiverId, userId, message);
    console.log(error, data);
    if (!error) {
      socket.emit("messageSent", data.senderMessage);
      const receiverSocket = findConnectedUser(receiverId);
      if (receiverSocket) {
        socket
          .to(receiverSocket.socketId)
          .emit("messageReceived", data.receiverMessage);
      }
    }
  });

  // ------------SET SEEN FOR RECEIVER ID-------------------
  socket.on("setSeen", async (receiverId) => {
    const { error, data } = await setSeen(receiverId, userId);
    console.log(error, data);
    if (!error) {
      const receiverSocket = findConnectedUser(receiverId);
      if (receiverSocket) {
        socket.to(receiverSocket.socketId).emit("receiveSeen", userId);
      }
    }
  });

  // ------------DISCONNECT REQUEST EVENT----------------------------
  socket.on("disconnect", () => {
    const users = removeUser(socketId);
    io.emit("online", {
      users,
    });
    console.log("client disconnected");
  });
});

// START SERVER
server.listen(8000, () => {
  console.log("Listening on PORT 8000");
});
