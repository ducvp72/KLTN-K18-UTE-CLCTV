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

  console.log("aaaas");

  try {
    userInfo = await userService.getUserById(socket.handshake.auth.userId);
  } catch (error) {
    console.log("Error", error);
    return;
  }

  // console.log("User infomation", userInfo);

  registerUserHanlers(io, socket, userInfo);

  registerRoomHanlers(io, socket, userInfo);

  // await socket.emit("room:chat", formatMessage(temp));
  // console.log("WELCOME", temp);

  socket.on("disconnect", () => {
    //Check if user in room
    const user = storeService.findUserById(socket.handshake.auth.userId);

    if (!user) return;

    storeService.deleteUserById(socket.handshake.auth.userId);

    // socket.emit("room:chat", formatMessage(leaveTempSocket));

    // Send users and room info to client was join
    user?.roomId?.forEach((room) => {
      //info to all room that user join
      io.to(room).emit(
        "room:chat",
        formatMessage({
          text: `${userInfo.fullname}  has left this room: ${room} `,
          image: null,
          video: null,
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
          typeId: new Date().getTime(),
          id: "96969696969696",
          user: {
            avatar:
              "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
            name: `${userInfo.fullname}`,
            _id: "6969696969696969",
          },
        })
      );

      //reset member in room to all user left in room
      io.to(room).emit("room:info", {
        room: room,
        users: storeService.getMemberInRoom(room),
      });
    });
  });
};

//Connect socket IO
io.on("connection", onConnection);

//listen port
httpServer.listen(config.PORT || 5000, () => {
  console.log("server run in Port: ", config.PORT || 5000);
});
