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
app.use(express.json());
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const notificationRoutes = require("./routes/notification");
app.use("/api", authRoutes);
app.use("/api/", notificationRoutes);
app.use("/api", userRoutes);

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
    users: users.filter((user) => user.userId !== userId),
  });

  // -------------FOLLOW REQUEST EVENT-------------------------
  socket.on("followRequest", async (followUserId) => {
    const { error, data } = await followRequest(followUserId, userId);
    if (!error) {
      const receiverSocket = findConnectedUser(followUserId);
      if (receiverSocket) {
        socket.to(receiverSocket.socketId).emit("NotificationReceived");
      }
    } else {
      socket.emit("followRequestError");
    }
  });

  // ------------ACCEPT REQUEST EVENT----------------------------
  socket.on("acceptRequest", async (requestedUserId) => {
    const { error, data } = await acceptRequest(requestedUserId, userId);
    if (!error) {
      socket.emit("NotificationReceived");
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
    if (!error) {
      socket.emit("NotificationReceived");
    } else {
      socket.emit("ignoreRequestError");
    }
  });

  // ------------DISCONNECT REQUEST EVENT----------------------------
  socket.on("disconnect", () => {
    const users = removeUser(socketId);
    io.emit("online", {
      users: users.filter((user) => user.userId !== userId),
    });
    console.log("client disconnected");
  });
});

// START SERVER
server.listen(8000, () => {
  console.log("Listening on PORT 8000");
});
