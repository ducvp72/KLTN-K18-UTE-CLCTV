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
  await adminService.deleteAdmin(req.user._id);
  res.status(httpStatus.OK).send('Admin was delete !');
});

const changeAdminProfile = catchAsync(async (req, res) => {
  const upadate = await adminService.updateAdminById(req.user, req.body);
  res.status(httpStatus.OK).send(upadate);
});

const changeAdminPassword = catchAsync(async (req, res) => {
  await adminService.changeAdminPassword(req.user, req.body.oldPassword, req.body.password);
  res.status(httpStatus.OK).send('Password is updated');
});

const resetAdminPassword = catchAsync(async (req, res) => {
  await adminService.resetAdminPassword(req.body.email);
  res.status(httpStatus.OK).send();
});

const resetUserPassword = catchAsync(async (req, res) => {
  await adminService.resetUserPassword(req.body.email, req.user);
  res.status(httpStatus.OK).send('Reset OK');
});

const getUserForAdmin = catchAsync(async (req, res) => {
  if (req.body.userId && req.body.email) {
    const rsb = await adminService.getUserForAdmin(req.body, req.user);
    res.status(httpStatus.OK).send(rsb);
    return;
  }
  if (req.body.email) {
    const rse = await adminService.getUserForAdmin(req.body.email, req.user);
    res.status(httpStatus.OK).send(rse);
    return;
  }
  if (req.body.userId) {
    const rs = await adminService.getUserForAdmin(req.body.userId, req.user);
    res.status(httpStatus.OK).send(rs);
  }
});

const banUser = catchAsync(async (req, res) => {
  const check = await adminService.banUser(req.body.userId);
  if (check === true) {
    res.status(httpStatus.OK).send('User was banned');
  } else res.status(httpStatus.OK).send('User  unbanned');
});

const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUser(req.body.userId);
  res.status(httpStatus.OK).send('User was deleted');
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullname', 'email', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const rs = await userService.queryUsers(filter, options);
  res.send(rs);
});

module.exports = {
  registerAdmin,
  login,
  deleteAdmin,
  changeAdminProfile,
  changeAdminPassword,
  resetAdminPassword,
  resetUserPassword,
  getUserForAdmin,
  banUser,
  deleteUser,
  getUsers,
};
