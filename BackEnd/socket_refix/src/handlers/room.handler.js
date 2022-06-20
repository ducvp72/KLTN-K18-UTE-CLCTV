module.exports = (io, socket, userInfo) => {
  const { getRoomInfo, leaveRoom, joinRoom, chatToGroup, signalUser } =
    require("../services/room.service")(io, socket, userInfo);

  socket.on("room:join", joinRoom);
  socket.on("room:out", leaveRoom);
  socket.on("room:chat", chatToGroup);
  socket.on("room:info", getRoomInfo);
  socket.on("room:signal", signalUser);

  // io.of("/").adapter.on("join-room", eventJoinRoom);
  // io.of("/").adapter.on("leave-room", eventLeftRoom);
};
