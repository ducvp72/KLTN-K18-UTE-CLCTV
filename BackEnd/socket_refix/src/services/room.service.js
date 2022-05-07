const { User, Room, UserGroup } = require("../models/");

const {
  checkInRoomById,
  deleteRoomOfUser,
  getMemberInRoom,
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

    // console.log("\n");
    // console.log("ROOM ID" + " " + roomId);
    // console.log("\n");
    // console.log("MESSAGE" + " " + { message });

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

  const getRoomInfo = async function (roomId) {
    console.log("ON-SERVER - room:info", roomId);
    await io.in(roomId).emit("room:info", {
      room: roomId,
      users: getMemberInRoom(roomId),
    });
  };

  const joinRoom = (roomId) => {
    socket.join(roomId);
    console.log("RoomHandler", socket.rooms);
  };

  const leaveRoom = async (roomId) => {
    const user = checkInCurrentRoom(userInfo.id, roomId);

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

    socket.to(roomId).emit("room:chat", formatMessage(leaveTemp));

    getRoomInfo(roomId);
  };

  const inviteRoom = async ({ userId, roomId }) => {
    const checkIn = await checkInGroupDB(userId, roomId);
    if (checkIn) {
      console.log("Check before invite if", userStore);

      io.to(socket.id).emit("room:invite", {
        status: true,
        message: `${userId} currently in this room ${roomId} `,
      });
    } else {
      const userStore = checkInCurrentRoom(userId, roomId);
      console.log("do something");

      console.log("Check before invite else", userStore);

      // io.to(socket.id).emit("room:invite", {
      //   status: true,
      //   message: `${userId} currently in this room ${roomId} `,
      // });
    }
  };

  return {
    getRoomInfo,
    joinRoom,
    leaveRoom,
    chatToGroup,
    inviteRoom,
  };
};
