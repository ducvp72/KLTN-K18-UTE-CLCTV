const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const config = require("./configs/config");
const { userService, storeService } = require("./services");
const formatMessage = require("./utils/messages");
const { ExpressPeerServer } = require("peer");
const registerUserHanlers = require("./handlers/user.handler");
const registerRoomHanlers = require("./handlers/room.handler");
// const AuthMiddlesware = require("./middlewares/auth");

const app = express();

//Connect DB
mongoose.connect(config.mongoose.url).then(() => {
  console.log("Connect DB");
});

//Cors
app.use(cors());
app.options("*", cors());

//Get Layout Test with path: "/"
app.use(express.static(path.join(__dirname, "../public")));

//Create httpServer
const httpServer = http.createServer(app);

//config peerSever with peerJS
const peerServer = ExpressPeerServer(httpServer, {
  path: "/call",
});

//create special path for peerServer to call video,
app.use("/peerjs", peerServer);

//config io socket
const io = socketio(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    methods: ["GET", "POST", "PUT", "OPTIONS"],
  },
});

// Middleware if use jwt to connect
// io.use(AuthMiddlesware());

//first connection
const onConnection = async (socket) => {
  let userInfo;
  console.log("userSocket id", socket.handshake.auth.userId);

  const checkIn = storeService.findUserById(socket.handshake.auth.userId);

  if (checkIn) {
    console.log("IN THIS ROOM", checkIn);
    socket.emit("room:inRoom", `You in this room`);
    return;
  }

  try {
    userInfo = await userService.getUserById(socket.handshake.auth.userId);
  } catch (error) {
    console.log("Error", error);
    return;
  }

  // console.log("User infomation", userInfo);

  registerUserHanlers(io, socket, userInfo);

  registerRoomHanlers(io, socket, userInfo);

  socket.on("disconnect", () => {
    //Check if user in room
    // const user = storeService.findUserById(socket.handshake.auth.userId);
    const user = storeService.getInfoById(socket.handshake.auth.userId);

    storeService.deleteUserById(socket.handshake.auth.userId);

    if (!user) return;
    console.log("user", user);
  });
};

//Connect socket IO
io.on("connection", onConnection);

//listen port
httpServer.listen(config.PORT || 5000, () => {
  console.log("server run in Port: ", config.PORT || 5000);
});
