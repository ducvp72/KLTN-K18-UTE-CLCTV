const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const config = require("./configs/config");
const AuthMiddlesware = require("./middlewares/auth");
const { userService } = require("./services");
const { userLeave, getRoomUsers } = require("./utils/users");
const formatMessage = require("./utils/messages");
const { addUser, users, removeUser } = require("./utils/db_socket");
const app = express();

mongoose.connect(config.mongoose.url).then(() => {
  console.log("Connect DB");
});

app.use(express.static(path.join(__dirname, "../public")));

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    methods: ["GET", "POST", "PUT", "OPTIONS"],
  },
});

// const peerServer = ExpressPeerServer(httpServer, {
//   path: "/meeting",
// });
// app.use("/peerjs", peerServer);

const registerUserHanlers = require("./handlers/user.handler");
const registerRoomHanlers = require("./handlers/room.handler");

//Cors
app.use(cors());
app.options("*", cors());

// Middleware;
// io.use(AuthMiddlesware());

const onConnection = async (socket) => {
  console.log("userSocket id", socket.handshake.auth.userId);

  console.log(users);
  let userInfo;
  try {
    userInfo = await userService.getUserById(socket.handshake.auth.userId);
  } catch (error) {
    console.log("Error", error);
    return;
  }

  console.log("User infoooo", userInfo);

  addUser(socket.handshake.auth.userId, socket.id);

  registerUserHanlers(io, socket, userInfo);

  registerRoomHanlers(io, socket, userInfo);

  const temp = {
    text: `Welcome you ${userInfo.fullname ? userInfo.fullname : "Unknown"} , ${
      socket.id
    }, ${socket.handshake.auth.userId} to chat`,
    image: null,
    video: null,
    createdAt: `${new Date()}`,
    updatedAt: `${new Date()}`,
    typeId: new Date().getTime(),
    id: "96969696969696",
    user: {
      avatar:
        "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
      name: "Admin Group",
      _id: "6969696969696969",
    },
  };

  // await socket.emit("room:chat", formatMessage(temp));
  console.log("WELCOME", temp);

  socket.on("room:out", (roomId) => {
    console.log("RROooom id", roomId);
    socket.broadcast.to(roomId).emit(
      "room:chat",
      formatMessage({
        text: `${userInfo.fullname}  has left the to room ${roomId}`,
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
    socket.leave(roomId);
    const clientsInRoom = io.in(roomId).allSockets();
    console.log("CLIENT", clientsInRoom);
  });

  socket.on("disconnect", () => {
    //Check if user in room
    removeUser(socket.id);
    const user = userLeave(socket.handshake.auth.userId);

    console.log(users);
    // console.log("userLeave", user);

    if (user) {
      console.log("User", user);
      // socket.emit("room:chat", formatMessage(leaveTempSocket));
      // io.to(user.roomId).emit("room:chat", formatMessage(leaveTemp));

      // Send users and room info to client
      // io.to(user.roomId).emit("room:info", {
      //   room: user.roomId,
      //   users: getRoomUsers(user.roomId),
      // });
    }
  });
};

io.on("connection", onConnection);
server.listen(config.PORT || 5000, () => {
  console.log("server run in Port: ", config.PORT || 5000);
});

module.exports = server;
