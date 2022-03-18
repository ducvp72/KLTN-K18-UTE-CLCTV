const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adminService, authService, userService, tokenService, emailService, codeService } = require('../services');

const registerAdmin = catchAsync(async (req, res) => {
  const admin = await adminService.createAdmin(req.body);
  const tokens = await tokenService.generateAuthTokens(admin);
  res.status(httpStatus.CREATED).send({ admin, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminService.loginAdminWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(admin);
  res.send({ admin, tokens });
});

const deleteAdmin = catchAsync(async (req, res) => {
  console.log(req.user._id);
  await adminService.deleteAdmin(req.user._id);
  res.status(httpStatus.OK).send('Admin was delete !');
});

module.exports = { registerAdmin, login, deleteAdmin };
