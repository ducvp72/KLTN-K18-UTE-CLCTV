const userMap = new Map();
const socketArr = [];

const addSocketArr = async (socketId) => {
  socketArr.push(socketId);
  // console.log("Socket Arr", socketArr);
};

const removeSocketArr = async (socketId) => {
  console.log("Before remove", socketArr);
  const index = socketArr.indexOf(socketId);
  console.log(index);
  if (index > -1) {
    socketArr.splice(index, 1);
  }
  // console.log("After remove Arr socket", socketArr);
};

//Return true or false if find user
const findUserById = async (userId) => {
  const check = userMap.has(userId);
  return check;
};

const getInfoById = (userId) => {
  const check = userMap.get(userId);
  return check;
};

const checkInRoomById = (idU, idR) => {
  return userMap.get(idU).roomId.find((x) => x === idR) ? true : false;
};

// const addUser = async (idU, idS, userN, idR) => {
//   userMap.set(idU, { soketId: idS, userName: userN, roomId: idR });
//   console.log("after add", userMap);
// };

const addUser = async (idU, idS, userN, idR) => {
  userMap.set(idU, { soketId: idS, userName: userN, roomId: idR });
  console.log("after add", userMap);
};

const deleteUserById = async (idU) => {
  userMap.delete(idU);
  console.log("after remove", userMap);
};

const addSocketForUser = async (idU, socketAdd) => {
  const check = checkInRoomById(idU, socketAdd);
  if (check) {
    return;
  }
  userMap.get(idU).soketId.push(socketAdd);
  console.log("after add SocketId", userMap);
};

const deleteSocketOfUser = async (idU, socketDel) => {
  const check = await findUserById(idU);
  if (!check) return;
  userMap.get(idU).soketId.forEach((socket, index) => {
    if (socket === socketDel) {
      userMap.get(idU).soketId.splice(index, 1);
    }
  });
  console.log("after delete SocketId", userMap);
};

const addRoomForUser = async (idU, roomAdd) => {
  const check = checkInRoomById(idU, roomAdd);
  if (check) {
    return;
  }
  userMap.get(idU).roomId.push(roomAdd);
};

const deleteRoomOfUser = async (idU, roomDel) => {
  const check = await findUserById(idU);
  if (!check) return;
  userMap.get(idU).roomId.forEach((room, index) => {
    if (room === roomDel) {
      userMap.get(idU).roomId.splice(index, 1);
    }
  });
};

const getMemberInRoom = (idR) => {
  const convertArr = [...userMap].map(([userId, info]) => ({ userId, info }));
  return convertArr.filter((x) => x.info?.roomId.find((room) => room === idR));
};

//add user
// const arr = [4, 5, 6];
// addUser(1, 2, "Nam", arr);
// addUser(2, 3, "Lam", [4, 5]);

// console.log(checkInRoomById(1, 4));

// const mapIterator = userMap.values();

// console.log(mapIterator.next().value);

//add room for user in Arr Room Id
// addRoomForUser(1, 7);

//remove room from arr of User Room ID
// deleteRoomOfUser(1, 7);

//check InRoom

//tim user id
// console.log(findUserById(1).roomId);

//xoa user hoan toan user Id
// deleteUserById(2);

//get all thong tin
// console.log(userMap);

// const userNameArr = convertArr.map((x) => x.info.roomId);
// console.log(userNameArr);

// console.log("Member in Room ", getMemberInRoom(4));

module.exports = {
  userMap,
  socketArr,
  findUserById,
  addUser,
  deleteUserById,
  deleteRoomOfUser,
  addRoomForUser,
  getMemberInRoom,
  checkInRoomById,
  getInfoById,
  addSocketForUser,
  deleteSocketOfUser,

  addSocketArr,
  removeSocketArr,
};
