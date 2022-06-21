module.exports = (io, socket, userInfo) => {
  const {
    getRoomInfo,
    leaveRoom,
    joinRoom,
    chatToGroup,
    signalUser,
    signalRoom,
  } = require("../services/room.service")(io, socket, userInfo);

  socket.on("room:join", joinRoom);
  socket.on("room:out", leaveRoom);
  socket.on("room:chat", chatToGroup);
  socket.on("room:info", getRoomInfo);
  socket.on("room:signal", signalUser);
  socket.on("room:all", signalRoom);

  // io.of("/").adapter.on("join-room", eventJoinRoom);
  // io.of("/").adapter.on("leave-room", eventLeftRoom);
};
