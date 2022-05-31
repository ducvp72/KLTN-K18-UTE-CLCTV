const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { groupService } = require('../services');

const createChat = catchAsync(async (req, res) => {
  const chat = await groupService.createChat(req.user, req.body.memberId);
  res.status(httpStatus.CREATED).send(chat);
});

const getQrGroup = catchAsync(async (req, res) => {
  const rs = await groupService.getQrGroup(req.user, req.body.groupId);
  res.status(httpStatus.OK).send(rs);
});

const createGroup = catchAsync(async (req, res) => {
  const result = await groupService.createGroup(req.user);
  res.status(httpStatus.CREATED).send(result);
});

const getGroupById = catchAsync(async (req, res) => {
  const rs = await groupService.getGroupInfo(req.params.groupId);
  res.status(httpStatus.OK).send(rs);
});

const getUsersToAdd = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['key', 'groupId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await groupService.getUserToAdd(req.user, filter, options);
  res.send(result);
});

const changeNameGroup = catchAsync(async (req, res) => {
  const result = await groupService.changeNameGroup(req.user, req.body);
  res.status(httpStatus.OK).send(result);
});

const deleteNameGroup = catchAsync(async (req, res) => {
  const result = await groupService.deleteNameGroup(req.user, req.body);
  res.status(httpStatus.OK).send(result);
});

const deleteGroup = catchAsync(async (req, res) => {
  await groupService.deleteGroup(req.user, req.body);
  res.status(httpStatus.OK).send();
});

const searchMember = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['key', 'groupId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const rs = await groupService.searchMember(req.user, filter, options);
  res.status(httpStatus.CREATED).send(rs);
});

const checkMember = catchAsync(async (req, res) => {
  const rs = await groupService.checkMember(req.body);
  res.status(httpStatus.OK).send(rs);
});

const getMyGroup = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['key']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const rs = await groupService.getMyGroup(req.user, filter, options);
  res.status(httpStatus.OK).send(rs);
});

const addMember = catchAsync(async (req, res) => {
  await groupService.addMember(req.user, req.body);
  res.status(httpStatus.CREATED).send();
});

const deleteMember = catchAsync(async (req, res) => {
  await groupService.deleteMember(req.user, req.body);
  res.status(httpStatus.OK).send();
});

const setAdminGroup = catchAsync(async (req, res) => {
  await groupService.setAdminGroup(req.user, req.body);
  res.status(httpStatus.OK).send();
});

const joinGroup = catchAsync(async (req, res) => {
  await groupService.joinGroup(req.user, req.body);
  res.status(httpStatus.CREATED).send();
});

const leaveGroup = catchAsync(async (req, res) => {
  await groupService.leaveGroup(req.user, req.body);
  res.status(httpStatus.OK).send();
});

const acceptRequest = catchAsync(async (req, res) => {
  await groupService.acceptRequest(req.user, req.body);
  res.status(httpStatus.CREATED).send();
});

const cancleRequest = catchAsync(async (req, res) => {
  await groupService.cancleRequest(req.user, req.body);
  res.status(httpStatus.OK).send();
});

const getListToAccept = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['key', 'groupId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const rs = await groupService.getListToAccept(req.user, filter, options);
  res.status(httpStatus.OK).send(rs);
});

const getGroupLink = catchAsync(async (req, res) => {
  const rs = await groupService.getGroupLink(req.user.id, req.params.groupId);
  res.status(httpStatus.OK).send(rs);
});

const getGroupPrivate = catchAsync(async (req, res) => {
  const rs = await groupService.getGroupPrivate(req.body.userId, req.body.friendId);
  res.status(httpStatus.OK).send(rs);
});

const adjustGroup = catchAsync(async (req, res) => {
  const rs = await groupService.adjustGroup(req.body.groupId, req.body.seen);
  res.status(httpStatus.OK).send(rs);
});

const userJoinGroupByCode = catchAsync(async (req, res) => {
  const rs = await groupService.userJoinGroupByCode(req.user, req.body.groupId, req.body.code);
  res.status(httpStatus.OK).send(rs);
});

const setStatusGroup = catchAsync(async (req, res) => {
  const rs = await groupService.setStatusGroup(req.user, req.body.groupId, req.body.status);
  res.status(httpStatus.OK).send(rs);
});

module.exports = {
  checkMember,
  getGroupById,
  getMyGroup,
  searchMember,
  createGroup,
  changeNameGroup,
  deleteGroup,
  addMember,
  deleteMember,
  setAdminGroup,
  joinGroup,
  leaveGroup,
  acceptRequest,
  cancleRequest,
  createChat,
  getUsersToAdd,
  deleteNameGroup,
  getListToAccept,
  getGroupLink,
  getGroupPrivate,
  adjustGroup,
  userJoinGroupByCode,
  setStatusGroup,
  getQrGroup,
};
