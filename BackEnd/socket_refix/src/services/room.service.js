const { User, Room, UserGroup } = require("../models/");

const {
  checkInRoomById,
  deleteRoomOfUser,
  getMemberInRoom,
  addRoomForUser,
  findUserById,
  getInfoById,
} = require("../services/store.service");
const { checkInGroupDB } = require("./user.service");
const formatMessage = require("../utils/messages");

module.exports = (io, socket, userInfo) => {
  const chatToGroup = async ({ roomId, message }) => {
    //CHECK IN DB THAT HE/SHE IN GROUP
    // const checkIn = await UserGroup.findOne({
    //   groupId: roomId,
    //   member: userInfo.id,
    // });
    const checkIn = socket.rooms.has(roomId);
    console.log("CheckInGroup", checkIn);

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
    // io.emit("room:chat", formatMessage(message));

    socket.broadcast.to(roomId).emit("room:chat", formatMessage(message));
  };

  const getRoomInfo = async (roomId) => {
    await io.in(roomId).emit("room:info", {
      room: roomId,
      users: getMemberInRoom(roomId),
    });
  };

  const joinRoom = async (roomId) => {
    const check = findUserById(userInfo.id);
    if (check) {
      const mark = checkInRoomById(userInfo.id, roomId);
      if (mark) {
        const tempCurrent = {
          text: `You have joinned this room ${roomId} `,
          image: null,
          video: null,
          typeId: new Date().getTime(),
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
          id: "999",
          user: {
            avatar:
              "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
            name: "System",
            _id: "9999",
          },
        };
        console.log();
        socket.emit("room:chat", formatMessage(tempCurrent)); //sending to sender-client only
      } else {
        await socket.join(roomId);
        const temp = {
          text: `${userInfo?.fullname}  has joined this  room ${roomId} `,
          image: null,
          video: null,
          typeId: new Date().getTime(),
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
          id: "999",
          user: {
            avatar:
              "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
            name: "Admin",
            _id: "9999",
          },
        };
        // Broadcast when a user connects
        // socket.broadcast.to(roomId).emit("room:chat", formatMessage(temp));
        await addRoomForUser(userInfo.id, roomId);
        getRoomInfo(roomId);
        console.log("RoomHandler", socket.rooms);
      }
    }
  };

  const leaveRoom = async (roomId) => {
    const user = checkInRoomById(userInfo.id, roomId);

    const leaveTemp = {
      text: `${userInfo.fullname}  has left this room : ${roomId}`,
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

    //Xoa khoi db
    // await UserGroup.findOneAndDelete({
    //   groupId: roomId,
    //   member: userInfo.id,
    // });

    //reset lai phong

    console.log("Check thanh vien hien tai", socket.rooms);

    if (!user) return;

    const clientsInRoom = io.in(roomId).allSockets();
    console.log("CLIENT LEFT OF ROOM: ", roomId + " " + clientsInRoom);

    await socket.leave(roomId);

    await deleteRoomOfUser(userInfo.id, roomId);

    // socket.to(roomId).emit("room:chat", formatMessage(leaveTemp));

    getRoomInfo(roomId);
  };

  const kickOut = async (info, roomId) => {
    io.to(info.soketId).emit("room:getout", { roomId });
  };

  const kickUser = async ({ userId, roomId }) => {
    console.log("Server ON EVENT - room:kick");
    console.log(userId);
    console.log(roomId);

    const user = checkInRoomById(userInfo.id, roomId);
    if (!user) return;
    const check = getInfoById(userId);
    console.log("Kick", check);
    kickOut(check, roomId);
  };

  const kickByAdmin = async (roomId) => {
    const leaveTemp = {
      text: `Admin has kick  ${userInfo.fullname} `,
      image: null,
      video: null,
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`,
      typeId: new Date().getTime(),
      id: "96969696969696",
      user: {
        avatar:
          "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
        name: `Admin`,
        _id: "6969696969696969",
      },
    };

    //Xoa khoi db
    // await UserGroup.findOneAndDelete({
    //   groupId: roomId,
    //   member: userInfo.id,
    // });

    //reset lai phong

    console.log("Check thanh vien hien tai", socket.rooms);

    // const clientsInRoom = io.in(roomId).allSockets();
    // console.log("CLIENT LEFT OF ROOM: ", roomId + " " + clientsInRoom);

    await socket.leave(roomId);

    await deleteRoomOfUser(userInfo.id, roomId);

    // socket.to(roomId).emit("room:chat", formatMessage(leaveTemp));

    getRoomInfo(roomId);

    console.log("Server ON EVENT - room:kickByAdmin", roomId);
  };

  const signalUser = async ({ userId, message }) => {
    const checkOnline = await getInfoById(userId);
    console.log("message:", { userId, message });
    if (!checkOnline) {
      console.log("Not found user to signal !");
      console.log("From socketId", socket.id);
      console.log("From userId", socket.handshake.auth.userId, "to", userId);
      return;
    }
    console.log("userId target:", userId, "\n", "info:", checkOnline);
    console.log("message:", message);

    io.to(checkOnline.soketId).emit("room:load", message);
  };

  // const inviteRoom = async ({ userId, roomId }) => {
  //   const checkIn = await checkInGroupDB(userId, roomId);
  //   if (checkIn) {
  //     console.log("Check before invite if", userStore);

  //     io.to(socket.id).emit("room:invite", {
  //       status: true,
  //       message: `${userId} currently in this room ${roomId} `,
  //     });
  //   } else {
  //     console.log("do something");
  //     // io.to(socket.id).emit("room:invite", {
  //     //   status: true,
  //     //   message: `${userId} currently in this room ${roomId} `,
  //     // });
  //   }
  // };

  return {
    getRoomInfo,
    joinRoom,
    leaveRoom,
    chatToGroup,
    kickUser,
    kickByAdmin,
    signalUser,
  };
};
