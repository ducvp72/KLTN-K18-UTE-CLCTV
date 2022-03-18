const httpStatus = require('http-status');
const { Admin, User, Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const authController = require('../controllers/auth.controller');

const getAdminById = async (id) => {
  return Admin.findById(id);
};

const getAdminByEmail = async (email) => {
  return Admin.findOne({ email });
};

const createAdmin = async (adminBody) => {
  if (await User.isEmailTaken(adminBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await Admin.isEmailTaken(adminBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Admin.create(adminBody);
};

const loginAdminWithEmailAndPassword = async (email, password) => {
  const admin = await getAdminByEmail(email);
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return admin;
};

const updateAdminById = async (userId, updateBody) => {
  const user = await getAdminById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteAdmin = async (userId) => {
  if (!getAdminById(userId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect id');
  }
  await Token.deleteMany({ user: userId });
  await Admin.findByIdAndRemove(userId);
};

module.exports = {
  createAdmin,
  updateAdminById,
  getAdminByEmail,
  loginAdminWithEmailAndPassword,
  deleteAdmin,
};
