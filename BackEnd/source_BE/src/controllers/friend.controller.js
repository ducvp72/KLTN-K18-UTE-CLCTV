const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { friendService } = require('../services');
const pick = require('../utils/pick');

const checkFriend = catchAsync(async (req, res) => {
  const check = await friendService.isFriend(req.user.id, req.body.friendId);

  res.status(httpStatus.OK).send(`${check}`);
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

const addFriendTest = catchAsync(async (req, res) => {
  const friend = await friendService.acceptTest(req.user, req.body.friendId);
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
  console.log('aaaaaaaaaaaaaaaaaa');
  const friend = await friendService.accept(req.user, req.body.friendId);
  res.status(httpStatus.CREATED).send(friend);
});

const cancleFriend = catchAsync(async (req, res) => {
  await friendService.cancle(req.user, req.body.friendId);
  res.status(httpStatus.OK).send();
});

const blockFriend = catchAsync(async (req, res) => {
  const friend = await friendService.blockFriend(req.user, req.body.friendId);
  console.log('Friend', friend);
  if (friend === 0) {
    res.status(httpStatus.OK).send('Your friend was unblocked !');
    return;
  }
  res.status(httpStatus.OK).send('Your friend was blocked !');
});

const getListFriend = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'type']);
  const filter = pick(req.query, ['fullname', 'username', 'email', 'typeFriend']);
  const rs = await friendService.queryListFriend(req.user.id, filter, options);
  // console.log('rs pro', rs);
  res.status(httpStatus.OK).send(rs);
});

module.exports = {
  addFriend,
  unFriend,
  acceptFriend,
  cancleFriend,
  blockFriend,
  checkFriend,
  checkWaiting,
  checkisBlockedFriend,
  getListFriend,
  addFriendTest,
};
