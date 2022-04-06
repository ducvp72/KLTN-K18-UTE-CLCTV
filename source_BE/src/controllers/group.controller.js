const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { groupService } = require('../services');

const createChat = catchAsync(async (req, res) => {
  const chat = await groupService.createChat(req.user, req.body.memberId);
  res.status(httpStatus.CREATED).send(chat);
});

const createGroup = catchAsync(async (req, res) => {
  const result = await groupService.createGroup(req.user);
  res.status(httpStatus.CREATED).send(result);
});

const getGroup = catchAsync(async (req, res) => {});

const getGroupById = catchAsync(async (req, res) => {
  const rs = await groupService.getGroupInfo(req.body.groupId);
  res.status(httpStatus.OK).send(rs);
});

const checkMember = catchAsync(async (req, res) => {});

const changeNameGroup = catchAsync(async (req, res) => {
  const result = await groupService.changeNameGroup(req.user, req.body);
  res.status(httpStatus.OK).send(result);
});

const deleteGroup = catchAsync(async (req, res) => {});

const searchMember = catchAsync(async (req, res) => {});

const addMember = catchAsync(async (req, res) => {
  const result = await groupService.addMember(req.user, req.body);
  res.send(result);
});

const deleteMember = catchAsync(async (req, res) => {});

const setAdminGroup = catchAsync(async (req, res) => {});

const joinGroup = catchAsync(async (req, res) => {});

const leaveGroup = catchAsync(async (req, res) => {});

const acceptRequest = catchAsync(async (req, res) => {});

const cancleRequest = catchAsync(async (req, res) => {});

module.exports = {
  checkMember,
  getGroupById,
  getGroup,
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
};
