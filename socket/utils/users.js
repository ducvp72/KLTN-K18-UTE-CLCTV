const userArr = [];

//Join user to chat

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  userArr.push(user);
  return user;
};

//Get current User
const getCurrentUser = (id) => {
  return userArr.find((user) => user.id === id);
};

//User leaves chat
const userLeave = (id) => {
  const index = userArr.findIndex((user) => user.id === id);

  //Because if can not fin id user it will be retur -1
  if (index !== -1) {
    // Từ vị trí đÓ xoá đi 1 đơn vị
    const leaveUser = userArr.splice(index, 1)[0];
    console.log("Leave", leaveUser);
    return leaveUser;
  }
};

//Get room users
const getRoomUsers = (room) => {
  return userArr.filter((user) => user.room === room);
};

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
