const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getUsersForAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullname', 'email', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUsersForClient = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullname', 'email', 'subname', 'key']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await userService.queryUsersClient(req.user, filter, options);
  res.send(result);
});

module.exports = {
  getUsersForAdmin,
  getUsersForClient,
};
