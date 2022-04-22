const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("../utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "../public")));

//run when client connect
io.on("connection", (socket) => {
  console.log("hello socket...");

  //Welcome a User
  socket.emit("message", formatMessage("Admin", "Welcome to Chat !"));

  //Broadcast when ad user connects
  socket.broadcast.emit(
    "message",
    formatMessage("Admin", "A user has joined the chat")
  );

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", formatMessage("User", msg));
  });
});

const PORT = 8000 || 6000;

server.listen(PORT, () => {
  console.log("server run in Port: ", PORT);
});
