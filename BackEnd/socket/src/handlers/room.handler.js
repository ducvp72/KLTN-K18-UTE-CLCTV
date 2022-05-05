module.exports = (io, socket, userInfo) => {
  const {
    getRoomInfo,
    joinRoom,
    leaveRoom,
    eventJoinRoom,
    eventLeftRoom,
    chatToGroup,
    addMember,
  } = require("../services/room.service")(io, socket, userInfo);
  socket.on("room:join", joinRoom);
  // socket.on("room:leave", leaveRoom);
  socket.on("room:chat", chatToGroup);
  socket.on("room:addMember", addMember);

  // socket.on("room:info", getRoomInfo);
  // io.of("/").adapter.on("join-room", eventJoinRoom);
  // io.of("/").adapter.on("leave-room", eventLeftRoom);

  // when the client emits 'typing', we broadcast it to others
  socket.on("room:typing", async (roomid) => {
    console.log("roomid", roomid);
    await socket.broadcast.emit("room:userType", "co em day");
  });
  // when the client emits 'stop typing', we broadcast it to others
  socket.on("room:stopTyping", (roomid) => {
    socket.broadcast.emit("room:stopTyping", {
      username: socket.username,
    });
  });
};
