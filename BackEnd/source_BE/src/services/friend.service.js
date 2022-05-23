const httpStatus = require('http-status');
const { User, Friend, WaitingFriend } = require('../models');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const changeName = require('../utils/sort');

const checkUserValid = async (user, friendId) => {
  const check = userService.getUserById(friendId);
  const checkUser = userService.getUserById(user.id);

  if (!checkUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid User !');
  }
  if (!check) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid Friend User !');
  }
};
const isWaiting = async (userId, friendId) => {
  console.log('userId', userId);
  console.log('friendId', friendId);

  await checkUserValid(userId, friendId);
  const checkWaitingFriend = await WaitingFriend.findOne({ user: friendId, waitingFriends: userId });
  return checkWaitingFriend;
};

const firstWaiting = async (userId, friendId) => {
  await WaitingFriend.create({
    waitingFriends: userId,
    user: friendId,
  });
};

const checkFriend = async (userId, friendId) => {
  console.log('checkFriend', userId, '/n', friendId);
  let find = false;
  await checkUserValid(userId, friendId);
  const checkWaitingFriend = await Friend.findOne({ user: userId, friends: friendId });
  if (checkWaitingFriend) {
    find = true;
  }
  return find;
};

const isFriend = async (userId, friendId) => {
  // console.log('checkFriend', userId, '/n', friendId);
  // let find = false;
  // const checkWaitingFriend = await Friend.findOne({ user: userId, friends: friendId });
  // if (checkWaitingFriend) {
  //   find = true;
  // }
  // return find;
  // console.log('checkFriend', userId, '/n', friendId);
  let find = 0;
  const checkFriends = await Friend.findOne({ user: userId, friends: friendId });
  const checkWaitingOther = await WaitingFriend.findOne({ user: friendId, waitingFriends: userId });
  const checkWaitingMine = await WaitingFriend.findOne({ user: userId, waitingFriends: friendId });
  if (checkFriends) {
    //Bạn hay chưa với nó
    find = 1;
  } else if (checkWaitingOther) {
    //Mình có trong danh sách chờ kết bạn của nó không
    find = 2;
  } else if (checkWaitingMine) {
    //Nó có trong danh sách chờ kết bạn của mình không
    find = 3;
  } else find = 0;
  return find;
};

const addFriend = async (userId, friendId) => {
  console.log('addFriend', userId, '/n', friendId);

  if (userId === friendId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not add yourself !');
  }

  if ((await checkFriend(userId, friendId)) === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is your Friend !');
  }
  if ((await isWaiting(userId, friendId)) !== null || (await isWaiting(friendId, userId)) !== null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User in your waiting request !');
  }
  await firstWaiting(userId, friendId);
};

const firstAddFriend = async (userId, friendId) => {
  console.log('firstAddFriend', userId, '/n', friendId);
  await Friend.create({
    friends: friendId,
    user: userId,
  });

  await Friend.create({
    friends: userId,
    user: friendId,
  });
};

const cancle = async (user, friendId) => {
  await checkUserValid(user.id, friendId);
  // const check = await isWaiting(friendId, user.id);
  const check = await isWaiting(friendId, user.id);

  console.log(check);
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find User!');
  }
  try {
    await check.remove();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const deleteIvite = async (user, body) => {
  await checkUserValid(user, body.friendId);

  const check = await WaitingFriend.findOneAndRemove({
    $or: [
      {
        waitingFriends: [user.id, body.friendId],
      },
      {
        user: [user.id, body.friendId],
      },
    ],
  });

  console.log(check);

  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find Invitaion!');
  }
};

const accept = async (user, friendId) => {
  console.log('accept', user.id, '/n', friendId);

  if (user.id === friendId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not add yourself !');
  }
  await checkUserValid(user.id, friendId);

  const checkFr = await checkFriend(user.id, friendId);
  console.log('checkFr', checkFr);
  if (checkFr) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is your Friend !');
  } else {
    await cancle(user, friendId);
    //addFriend of User
    try {
      await firstAddFriend(user.id, friendId);
    } catch (err) {
      console.log(err);
    }
  }
};

const acceptTest = async (user, friendId) => {
  console.log('accept', user.id, '/n', friendId);

  if (user.id === friendId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not add yourself !');
  }
  await checkUserValid(user.id, friendId);

  const checkFr = await checkFriend(user.id, friendId);
  if (checkFr) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is your Friend !');
  } else {
    try {
      await firstAddFriend(user.id, friendId);
    } catch (err) {
      console.log(err);
    }
  }
};

const isBlockedFriend = async (userId, friendId) => {
  await checkUserValid(userId, friendId);
  const userCheck = await Friend.findOne({
    user: userId,
    friends: friendId,
  });
  if (!userCheck) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invaid User');
  }
  return userCheck.isBlocked;
};

const blockFriend = async (user, friendId) => {
  let userRes;
  const check = await isBlockedFriend(user.id, friendId);
  if (check) {
    console.log(1);
    await Friend.findOneAndUpdate({ user: user.id, friends: friendId }, { isBlocked: false })
      .then((res) => {
        console.log('res', res);
        userRes = 0;
      })
      .catch((err) => {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
      });
  } else {
    console.log(2);
    await Friend.findOneAndUpdate({ user: user.id, friends: friendId }, { isBlocked: true })
      .then((res) => {
        console.log('res', res);
        userRes = 1;
      })
      .catch((err) => {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
      });
  }

  return userRes;
};

const unFriend = async (user, friendId) => {
  await checkUserValid(user.id, friendId);
  if (!(await checkFriend(user.id, friendId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not your friend !');
  }
  try {
    await Friend.findOneAndRemove({
      user: user.id,
      friends: friendId,
    });

    await Friend.findOneAndRemove({
      user: friendId,
      friends: user.id,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const queryListFriend = async (userId, filter, options) => {
  // eslint-disable-next-line no-param-reassign
  filter.user = userId;

  const find = await Friend.find({ user: userId }).populate({
    path: 'friends',
    select: '-isActivated -role -isBanned',
  });
  // console.log('friends', find);
  if (!find) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid User !');
  }

  return find;
};

module.exports = {
  addFriend,
  isWaiting,
  blockFriend,
  accept,
  cancle,
  unFriend,
  checkFriend,
  isBlockedFriend,
  queryListFriend,
  isFriend,
  acceptTest,
  deleteIvite,
};
