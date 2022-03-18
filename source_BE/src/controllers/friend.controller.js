const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { friendService } = require('../services');

const checkFriend = catchAsync(async (req, res) => {
  const check = await friendService.checkFriend(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(check);
});

const checkisBlockedFriend = catchAsync(async (req, res) => {
  const check = await friendService.isBlockedFriend(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(check);
});

const addFriend = catchAsync(async (req, res) => {
  const friend = await friendService.addFriend(req.user, req.body.friendId);
  res.status(httpStatus.CREATED).send(friend);
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
  const friend = await friendService.cancle(req.user, req.body.friendId);
  res.status(httpStatus.OK).send(friend);
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
  checkisBlockedFriend,
};
