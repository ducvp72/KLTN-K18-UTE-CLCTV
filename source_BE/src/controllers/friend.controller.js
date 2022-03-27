const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { friendService } = require('../services');

const checkFriend = catchAsync(async (req, res) => {
  const check = await friendService.checkFriend(req.user.id, req.body.friendId);
  if (check) {
    res.status(httpStatus.OK).send('User is your friend ');
    return;
  }
  res.status(httpStatus.NOT_FOUND).send('User is not your friend');
});

const checkWaiting = catchAsync(async (req, res) => {
  const check = await friendService.isWaiting(req.user.id, req.body.friendId);
  if (check) {
    res.status(httpStatus.OK).send(true);
    return;
  }
  res.status(httpStatus.NOT_FOUND).send(false);
});
const addFriend = catchAsync(async (req, res) => {
  const friend = await friendService.addFriend(req.user.id, req.body.friendId);
  res.status(httpStatus.CREATED).send(friend);
});

const checkisBlockedFriend = catchAsync(async (req, res) => {
  const check = await friendService.isBlockedFriend(req.user, req.body.friendId);
  if (check) {
    res.status(httpStatus.OK).send(true);
    return;
  }
  res.status(httpStatus.OK).send(false);
});

const unFriend = catchAsync(async (req, res) => {
  const friend = await friendService.unFriend(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(friend);
});

const acceptFriend = catchAsync(async (req, res) => {
  const friend = await friendService.accept(req.user, req.body.friendId);
  res.status(httpStatus.CREATED).send(friend);
});

const cancleFriend = catchAsync(async (req, res) => {
  const check = await friendService.cancle(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(check);
});

const blockFriend = catchAsync(async (req, res) => {
  const friend = await friendService.blockFriend(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(friend);
});

const unblockFriend = catchAsync(async (req, res) => {
  const friend = await friendService.unblockFriend(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(friend);
});

module.exports = {
  addFriend,
  unFriend,
  acceptFriend,
  cancleFriend,
  blockFriend,
  unblockFriend,
  checkFriend,
  checkWaiting,
  checkisBlockedFriend,
};
