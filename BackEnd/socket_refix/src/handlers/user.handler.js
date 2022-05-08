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

  //map User Object
  await storeService.addUser(
    socket.handshake.auth.userId,
    socket.id,
    userInfo?.fullname,
    arrGroup
  );

  for (let i = 0; i < userGroups.length; i++) {
    //Join User in all chat if user is a Member of it
    await socket.join(userGroups[i].groupId.toString());

    const temp = {
      text: `${userInfo.fullname}  has joined this  room ${userGroups[
        i
      ].groupId.toString()} `,
      image: null,
      video: null,
      typeId: new Date().getTime(),
      createdAt: `${new Date()}`,
      updatedAt: `${new Date()}`,
      id: "96969696969696",
      user: {
        avatar:
          "https://res.cloudinary.com/kltn-k18-dl/image/upload/v1650966158/myGallary/azusjmrzhfmyzku9idpc.jpg",
        name: "Admin Group",
        _id: "6969696969696969",
      },
    };

    // console.log(userGroups[i].groupId.toString());

    // Broadcast when a user connects
    await socket.broadcast
      .to(userGroups[i].groupId.toString())
      .emit("room:chat", formatMessage(temp));
  }

  socket.emit("user:getUserInfo", { userInfo, socketId: socket.id });
};
