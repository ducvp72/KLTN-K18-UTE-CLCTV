const userMap = new Map();

const findUserById = (userId) => {
  const check = userMap.has(userId);
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

const deleteUserById = (idU) => {
  userMap.delete(idU);
  console.log("after remove", userMap);
};

const addRoomForUser = (idU, roomAdd) => {
  const check = checkInRoomById(idU, roomAdd);
  if (check) {
    console.log("co roi");
    return;
  }

  userMap.get(idU).roomId.push(roomAdd);
};

const deleteRoomOfUser = async (idU, roomDel) => {
  const check = findUserById(idU);
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
  findUserById,
  addUser,
  deleteUserById,
  deleteRoomOfUser,
  addRoomForUser,
  getMemberInRoom,
  checkInRoomById,
};
