const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

// eslint-disable-next-line spaced-comment
//My func
const getAllUser = catchAsync(async (req, res) => {
  const user = await userService.getUserAll();
  res.status(httpStatus.OK).send(user);
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUsersClient = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  let userN;
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // eslint-disable-next-line prefer-const
  userN = JSON.parse(JSON.stringify(user));
  delete userN.isBanned;
  delete userN.role;
  delete userN.isActivated;
  res.send(userN);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getAllUser,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersClient,
};
