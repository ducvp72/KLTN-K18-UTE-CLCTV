const formatMessage = require("../utils/messages");
const { User, UserGroup } = require("../models");

const { storeService } = require("../services/index");

module.exports = async (io, socket, userInfo) => {
  const userGroups = await UserGroup.find({
    member: socket.handshake.auth.userId,
  });

  const arrGroup = userGroups.map((x) => x.groupId.toString());

  // const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
  // console.log("aaaaaaaaaaaaaa", sockets);
  // const checkIN = sockets.find((item) => item === socket.id);

  // if (checkIN) {
  //   console.log("bbbbbbbbbbbbb", checkIN);
  //   return;
  // } else {
  //   console.log("Khong co");
  // }

  const checkOnline = await storeService.findUserById(
    socket.handshake.auth.userId
  );

  if (checkOnline) {
    console.log("Online: true");
    //Only add new socketId in arr Socket ID of exist user
    await storeService.addSocketForUser(
      socket.handshake.auth.userId,
      socket.id
    );
  } else {
    //add new map User Object
    console.log("Online: false");
    const arrSocketId = [socket.id];
    await storeService.addUser(
      socket.handshake.auth.userId,
      arrSocketId,
      userInfo?.fullname,
      arrGroup
    );
  }

  //add in arr socket
  await storeService.addSocketArr(socket.id);

  for (let i = 0; i < userGroups.length; i++) {
    //Join User in all chat if user is a Member of it
    await socket.join(userGroups[i].groupId.toString());
    // console.log(userGroups[i].groupId.toString());
  }

  socket.emit("user:getUserInfo", { userInfo, socketId: socket.id });
};
