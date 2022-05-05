const formatMessage = require("../utils/messages");
const { User, UserGroup } = require("../models");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("../utils/users");

module.exports = async (io, socket, userInfo) => {
  const userGroups = await UserGroup.find({
    member: socket.handshake.auth.userId,
  });

  // const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
  // console.log("aaaaaaaaaaaaaa", sockets);
  // const checkIN = sockets.find((item) => item === socket.id);

  // if (checkIN) {
  //   console.log("bbbbbbbbbbbbb", checkIN);
  //   return;
  // } else {
  //   console.log("Khong co");
  // }

  userGroups.forEach(async (group) => {
    //Join User in all chat if user is a Member of it
    await socket.join(group.groupId.toString());

    //add user in ARR exactly the room
    await userJoin(
      socket.handshake.auth.userId,
      group.groupId.toString(),
      userInfo.fullname,
      socket.id
    );

    // Send users and room info to client
    // await io.to(group.groupId.toString()).emit("room:info", {
    //   room: group.groupId.toString(),
    //   users: getRoomUsers(group.groupId.toString()),
    // });

    // Broadcast when a user connects

    const temp = {
      text: `${
        userInfo.fullname
      }  has joined room ${group.groupId.toString()} `,
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

    // await socket.broadcast
    //   .to(group.groupId.toString())
    //   .emit("room:chat", formatMessage(temp));
  });

  // console.log("UserHandler:joinroom", socket.rooms);

  // console.log(userInfo);
  socket.emit("user:getUserInfo", userInfo);
};
