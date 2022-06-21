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
    console.info(
      "-----------------------------Start----------------------------------"
    );
    //Check if has in roomId
    const checkIn = socket.rooms.has(roomId);
    console.log("CheckInGroup", checkIn);
    if (!checkIn) return;

    console.log("userInfo: ", userInfo.id);

    //get all socket inroom
    const socketArr = await io.in(roomId).fetchSockets();
    const arrUser = [];
    await socketArr.forEach((element) => {
      // console.log(element.id);
      arrUser.push(element.id);
    });
    console.log("arrUser in room", arrUser);

    //Check exist
    // const checkMultiOnline = await getInfoById(userInfo.id);
    // if (checkMultiOnline.soketId.length >= 2) {
    //   // console.log("If has multi", checkMultiOnline);
    //   console.log("List", checkMultiOnline.soketId);

    //   const filterMulti = arrUser.filter((socketid) => {
    //     return !checkMultiOnline.soketId.includes(socketid);
    //   });

    //   console.log("filterMulti", filterMulti);
    //   filterMulti.forEach((socketid, index) => {
    //     io.to(socketid).emit("room:chat", formatMessage(message));
    //   });
    //   return;
    // }

    socket.broadcast.to(roomId).emit("room:chat", formatMessage(message));
    console.info(
      "-------------------------------End--------------------------------",
      "\n"
    );
    //all socket
    // io.emit("room:chat", formatMessage(message));
  };

  const getRoomInfo = async (roomId) => {
    await io.in(roomId).emit("room:info", {
      room: roomId,
      users: getMemberInRoom(roomId),
    });
  };

  const joinRoom = async (roomId) => {
    const check = await findUserById(userInfo.id);
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

    checkOnline.soketId.forEach((socketid) => {
      //Cach cu //roomTemp
      // io.sockets.sockets.get(socketid).join(userId);

      io.to(socketid).emit("room:load", message);
    });

    //Cach cu //roomTemp
    // io.to(userId).emit("room:load", message);

    //Cach cu //leave temp room //roomTemp
    // io.socketsLeave(userId);
  };

  const signalRoom = async ({ roomId, message }) => {
    socket.broadcast.to(roomId).emit("room:specRoom", message);
  };

  return {
    getRoomInfo,
    joinRoom,
    leaveRoom,
    chatToGroup,
    signalUser,
    signalRoom,
  };
};
