const httpStatus = require('http-status');
const { forEach } = require('lodash');
const { User, Friend, WaitingFriend, BlackFriend } = require('../models');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

const checkUserValid = (user, friendId) => {
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
  checkUserValid(userId, friendId);
  const checkWaitingFriend = await WaitingFriend.findOne({ user: userId, waitingFriends: friendId });
  return checkWaitingFriend;
};

const deleteWaiting = async (userId) => {
  console.log('deleteWaiting', userId);
  const check = await WaitingFriend.findOne({ user: userId });
  if (check.waitingFriends.length === 0) {
    await check.remove();
  }
};

const firstWaiting = async (userId, friendId) => {
  console.log('firstWaiting', userId, '/n', friendId);
  const check = await WaitingFriend.findOne({ user: userId });
  if (check) {
    console.log('check-firstWaiting');
    await check.waitingFriends.push(friendId);
    await check.save();
  } else {
    console.log('check-firstWaiting2');
    await WaitingFriend.create({
      waitingFriends: friendId,
      user: userId,
    });
  }
};
const checkFriend = async (userId, friendId) => {
  console.log('checkFriend', userId, '/n', friendId);
  let find = false;
  checkUserValid(userId, friendId);
  const checkWaitingFriend = await Friend.findOne({ user: userId });
  if (checkWaitingFriend) {
    checkWaitingFriend.friends.forEach((i) => {
      const ii = JSON.stringify(i);
      if (ii === `"${friendId}"`) {
        find = true;
      }
    });
  }
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
  //Add UserWaiting
  // await WaitingFriend.create({
  //   waitingFriends: friendId,
  //   user: userId,
  // });
};
const firstAddFriend = async (userId, friendId) => {
  console.log('firstAddFriend', userId, '/n', friendId);

  const check = await Friend.findOne({ user: userId });
  if (check) {
    console.log('firstAddFriend2');
    check.friends.push(friendId);
    await check.save();
  } else {
    await Friend.create({
      friends: friendId,
      user: userId,
    });
  }
};

const cancle = async (user, friendId) => {
  checkUserValid(user.id, friendId);
  const check = await isWaiting(user.id, friendId);
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find User!');
  }
  try {
    const userCheck = await WaitingFriend.findOne({
      user: user.id,
    });
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userCheck.waitingFriends.length; i++) {
      if (JSON.stringify(userCheck.waitingFriends[i]) === `"${friendId}"`) {
        userCheck.waitingFriends.splice(i, 1);
        // eslint-disable-next-line no-plusplus
        i--;
      }
    }
    await userCheck.save();
    deleteWaiting(user.id);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const accept = async (user, friendId) => {
  console.log('accept', user.id, '/n', friendId);

  if (user.id === friendId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not add yourself !');
  }
  checkUserValid(user.id, friendId);

  if ((await checkFriend(user.id, friendId)) === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is your Friend !');
  }
  // await WaitingFriend.findOneAndRemove({
  //   waitingFriends: friendId,
  //   user: user.id,
  // });
  cancle(user, friendId);
  //addFriend of User
  try {
    await firstAddFriend(friendId, user.id);
    await firstAddFriend(user.id, friendId);
  } catch (err) {
    console.log(err);
  }
};

const isBlockedFriend = async (userId, friendId) => {
  checkUserValid(userId, friendId);

  const userCheck = await Friend.findOne({
    user: userId,
  });
  console.log('isBlockedFriend', userCheck.blackfriends);
  // eslint-disable-next-line no-plusplus
  if (userCheck) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userCheck.blackfriends.length; i++) {
      if (JSON.stringify(userCheck.blackfriends[i]) === `"${friendId}"`) {
        // eslint-disable-next-line no-plusplus
        console.log('isBlockedFriend2', userCheck.blackfriends[i]);
        return true;
      }
    }
  }
  return false;
};

const blockFriend = async (user, friendId) => {
  const check = await isBlockedFriend(user.id, friendId);
  if (check) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not blocked once again !');
  }
  console.log('blockFriend', check);
  const userCheck = await Friend.findOne({
    user: user.id,
  });
  await userCheck.blackfriends.push(friendId);
  await userCheck.save();
};

const unblockFriend = async (user, friendId) => {
  if (!isBlockedFriend(user.id, friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User was not blocked !');
  }
  try {
    const userCheck = await Friend.findOne({
      user: user.id,
    });
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userCheck.blackfriends.length; i++) {
      if (JSON.stringify(userCheck.blackfriends[i]) === `"${friendId}"`) {
        userCheck.blackfriends.splice(i, 1);
        // eslint-disable-next-line no-plusplus
        i--;
      }
    }
    await userCheck.save();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const unFriend = async (user, friendId) => {
  checkUserValid(user.id, friendId);

  try {
    const userCheck = await Friend.findOne({
      user: user.id,
    });
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userCheck.friends.length; i++) {
      if (JSON.stringify(userCheck.friends[i]) === `"${friendId}"`) {
        userCheck.friends.splice(i, 1);
        // eslint-disable-next-line no-plusplus
        i--;
      }
    }
    await userCheck.save();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

module.exports = {
  addFriend,
  isWaiting,
  blockFriend,
  unblockFriend,
  accept,
  cancle,
  unFriend,
  checkFriend,
  isBlockedFriend,
};
