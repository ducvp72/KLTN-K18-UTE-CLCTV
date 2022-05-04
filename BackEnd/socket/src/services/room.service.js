const { User, Room, UserGroup } = require("../models/");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");
const { getUser } = require("../utils/db_socket");
const formatMessage = require("../utils/messages");
module.exports = (io, socket, userInfo) => {
  const getRoomInfo = function ({ roomId }) {
    console.log("Roomasdasdad", roomId);
    io.to(roomId).emit("room:info", {
      room: roomId,
      users: getRoomUsers(roomId),
    });
  };
  const joinRoom = (roomId) => {
    socket.join(roomId);
    console.log("RoomHandler", socket.rooms);
  };

  const chatToGroup = async ({ roomId, message }) => {
    //CHECK IN DB THAT HE/SHE IN GROUP
    // const checkIn = await UserGroup.findOne({
    //   groupId: roomId,
    //   member: userInfo.id,
    // });
    const checkIn = socket.rooms.has(roomId);
    console.log("CheckInGroup", checkIn);
    console.log("\n");
    console.log("ROOM ID" + " " + roomId);
    console.log("\n");
    console.log("MESSAGE" + " " + { message });

    if (!checkIn) return;

    // const a = await io.in(roomId).fetchSockets();
    // const clientsInRoom = io
    //   .in(roomId)
    //   .allSockets()
    //   .then((rs) => console.log("clientsInRoom", rs));
    // console.log("clientsInRoomss", clientsInRoom);
    // const checkSize = io.sockets.adapter.rooms.get(roomId);
    // console.log("clientsInRoom2", checkSize);
    // const checkSocketId = await io.sockets.adapter.sockets(new Set([roomId]));
    // console.log("idclient", checkSocketId);
    // const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
    // console.log(sockets);

    const socketArr = await io.in(roomId).fetchSockets();
    const arrUser = [];
    await socketArr.forEach((element) => {
      console.log(element.id);
      arrUser.push(element.id);
    });
    console.log("arr", arrUser);

    //all socket
    // io.to(roomId).emit("room:chat", formatMessage(message));

    socket.broadcast.to(roomId).emit("room:chat", formatMessage(message));
  };

  const addMember = ({ memberId, roomId }) => {
    console.log(memberId + "?" + roomId);
    const user = getUser(memberId);
    console.info(user);
    io.to(user.socketId).emit("room:invite", { roomId });
  };

  const leaveRoom = async (roomId) => {
    const user = userLeave(socket.handshake.auth.userId);
    // io.in(socket.id).socketsLeave(roomId);

    const leaveTemp = {
      text: `${userInfo.fullname}  has left the chat`,
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
    };

    await UserGroup.findOneAndDelete({
      groupId: roomId,
      member: userInfo.id,
    });

    socket.leave(roomId);
    console.log("aaadfdkfjdlfjdljf", socket.rooms);

    if (user) {
      // io.to(user.roomId).emit("room:chat", formatMessage(leaveTemp));
      console.log("aaaa");
    }

    // Send users and room info to client
    io.to(user.roomId).emit("room:info", {
      room: user.roomId,
      users: getRoomUsers(user.roomId),
    });
  };

  const eventJoinRoom = (roomId, userId) => {
    console.log(`socket ${userId} has joined room ${roomId}`);
    console.log(getRoomUsers(roomId));
    io.to(roomId).emit("room:info", {
      room: roomId,
      users: getRoomUsers(roomId),
    });
  };

  const eventLeftRoom = (roomId, userId) => {
    console.log(`socket ${userId} has left room ${roomId}`);
    io.in(socket.id).socketsLeave(roomId);
    io.to(roomId).emit("room:info", {
      room: roomId,
      users: getRoomUsers(roomId),
    });
  };

  return {
    getRoomInfo,
    joinRoom,
    leaveRoom,
    chatToGroup,
    addMember,
    eventJoinRoom,
    eventLeftRoom,
  };
};
