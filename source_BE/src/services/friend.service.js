const httpStatus = require('http-status');
const { User, Friend, WaitingFriend, BlackFriend, Conservation, Accept } = require('../models');
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

const checkFriend = async (userId, friendId) => {
  checkUserValid(userId, friendId);
  const checkWaitingFriend = Friend.findOne({ user: userId, friends: friendId });
  return !!checkWaitingFriend;
};

const isAccept = (userId, friendId) => {
  checkUserValid(userId, friendId);
  const checkAcceptFriend = Accept.findOne({ user: userId, friends: friendId });
  return !!checkAcceptFriend;
};

const isWaiting = (userId, friendId) => {
  checkUserValid(userId, friendId);
  const checkWaitingFriend = WaitingFriend.findOne({ user: userId, friends: friendId });
  return !!checkWaitingFriend;
};

const accept = async (user, friendId) => {
  checkUserValid(user.id, friendId);

  await Accept.findOneAndRemove({
    friends: friendId,
    user: user.id,
  });
  await WaitingFriend.findOneAndRemove({
    waitingFriends: user.id,
    user: friendId,
  });
  await Friend.create({
    friends: friendId,
    user: user.id,
  });
  await Friend.create({
    friends: user.id,
    user: friendId,
  });
};

const cancle = async (user, friendId) => {
  checkUserValid(user.id, friendId);

  await WaitingFriend.findOneAndRemove({
    waitingFriends: friendId,
    user: user.id,
  });
  await Accept.findOneAndRemove({
    friends: user.id,
    user: friendId,
  });
};

const addFriend = async (user, friendId) => {
  if (checkFriend(user.id, friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is your Friend !');
  }
  if (!isWaiting(user.id, friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not in waiting  !');
  }
  if (isAccept(user.id, friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User was add to Acceptable  !');
  }
  //Friend acceptable

  await Accept.create({
    friends: friendId,
    user: user.id,
  });

  //My acceptable

  await WaitingFriend.create({
    waitingFriends: user.id,
    user: friendId,
  });
};

const isBlockedFriend = async (userId, friendId) => {
  checkUserValid(userId, friendId);
  const check = await BlackFriend.findOne({
    blackFriends: friendId,
    user: userId,
  });
  return !!check;
};

const blockFriend = async (user, friendId) => {
  if (isBlockedFriend(user.id, friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User was blocked !');
  }
  await BlackFriend.create({
    blackFriends: friendId,
    user: user.id,
  });
};

const unblockFriend = async (user, friendId) => {
  if (!isBlockedFriend(user.id, friendId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User was not blocked !');
  }
  await BlackFriend.findOneAndRemove({
    blackFriends: friendId,
    user: user.id,
  });
};

const unFriend = async (user, friendId) => {
  checkUserValid(user.id, friendId);
  if (checkFriend(user.id, friendId)) {
    await Friend.findOneAndRemove({
      waitingFriends: user.id,
      user: friendId,
    });
    await Friend.findOneAndRemove({
      waitingFriends: friendId,
      user: user.id,
    });
  }
  if (isBlockedFriend(user.id, friendId)) {
    await BlackFriend.findOneAndRemove({
      waitingFriends: user.id,
      user: friendId,
    });
  }
  if (isBlockedFriend(friendId, user.id)) {
    await Friend.findOneAndRemove({
      waitingFriends: friendId,
      user: user.id,
    });
  }
};

module.exports = {
  addFriend,
  blockFriend,
  unblockFriend,
  accept,
  cancle,
  unFriend,
  checkFriend,
  isBlockedFriend,
};
