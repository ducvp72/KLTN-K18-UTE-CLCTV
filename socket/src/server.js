const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("../utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "../public")));

//run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log("username", username);
    socket.join(user.room);

    //Welcome a current User
    socket.emit(
      "message",
      formatMessage("Admin", `Welcome ${user.username} to Chat !`)
    );

    //Broadcast when ad user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Admin", `${user.username} has joined the chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  console.log("hello socket...");

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);

    //get Current Id Room to emit chat to room
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //leave room
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      console.log(user);

      io.to(user.room).emit(
        "message",
        formatMessage("Admin", `${user.username} has left the chat`)
      );

      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 8000 || 6000;

server.listen(PORT, () => {
  console.log("server run in Port: ", PORT);
});
