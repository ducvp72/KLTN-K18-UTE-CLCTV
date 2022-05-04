let users = [];
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    socketId = [socketId];
    users.push({
      userId,
      socketId,
    });
  } else {
    for (i of users) {
      if (i.userId == userId) i.socketId.push(socketId);
    }
  }
};

const removeUser = (socketId) => {
  // users = users.filter((user) => user.socketId !== socketId);
  for (i of users) {
    for (j of i.socketId)
      if (j == socketId) {
        i.socketId = i.socketId.filter((s) => s !== socketId);
        if (i.socketId.length === 0)
          users = users.filter((user) => user.socketId.length !== 0);
      }
  }
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
module.exports = { users, addUser, removeUser, getUser };
