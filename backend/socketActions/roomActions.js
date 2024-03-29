let connectedUsers = [];
const addUser = (userId, socketId) => {
  const user = connectedUsers.find((user) => user.userId == userId);
  if (user && user.socketId == socketId) {
    console.log(
      "no change+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    );
    console.log(connectedUsers);
    return connectedUsers;
  } else {
    if (user && user.socketId != socketId) {
      removeUser(user.socketId);
    }
    const newUser = { userId, socketId };
    connectedUsers.push(newUser);
    console.log(
      "push+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    );
    console.log(connectedUsers);
    return connectedUsers;
  }
};

const removeUser = (socketId) => {
  const indexOf = connectedUsers.map((user) => user.socketId).indexOf(socketId);
  connectedUsers.splice(indexOf, 1);
  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );
  console.log(connectedUsers);
  return connectedUsers;
};

const findConnectedUser = (userId) =>
  connectedUsers.find((user) => user.userId == userId);

module.exports = {
  addUser,
  removeUser,
  findConnectedUser,
};
