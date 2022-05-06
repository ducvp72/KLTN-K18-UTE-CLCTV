const userArr = [];
//Join user to chat

const userJoin = async (userId, roomId, userName, socketId) => {
  const user = { userId, roomId, userName, socketId };
  userArr.push(user);
  // console.log("userArr", userArr);
  return user;
};

//Get current User
const getCurrentUser = (id) => {
  return userArr.find((user) => user.userId === id);
};

//User leaves chat
const userLeave = (id) => {
  const index = userArr.findIndex((user) => user.userId === id);

  //Because if can not fin id user it will be retur -1
  if (index !== -1) {
    // Từ vị trí đÓ xoá đi 1 đơn vị
    const leaveUser = userArr.splice(index, 1)[0];
    // console.log("Leave", leaveUser);
    // console.log("User", userArr);
    return leaveUser;
  }
};

//Get room users
const getRoomUsers = (room) => {
  return userArr.filter((user) => user.roomId === room);
};

//Get room users
const getUserInRoom = (userId) => {
  return userArr.filter((user) => user.userId === userId);
};

module.exports = {
  userJoin,
  getCurrentUser,
  getUserInRoom,
  userLeave,
  getRoomUsers,
};
