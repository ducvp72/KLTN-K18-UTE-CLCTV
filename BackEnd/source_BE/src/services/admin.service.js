const httpStatus = require('http-status');
const { Admin, User, Token } = require('../models');
const { userService, emailService, authService } = require('../services');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const authController = require('../controllers/auth.controller');
const { roleTypes } = require('../config/myConfig');

const getAdminById = async (id) => {
  return Admin.findById(id);
};

const getAdminByEmail = async (email) => {
  return Admin.findOne({ gmail: email });
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
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return admin;
};

const updateAdminById = async (user, userN) => {
  let userRes;
  const findUser = await getAdminById(user.id);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await Admin.findByIdAndUpdate(
    user.id,
    {
      fullname: userN.fullname,
      phone: userN.phone,
    },
    { new: true, useFindAndModify: false }
  )
    .then((updateUser) => {
      userRes = updateUser;
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });

  return userRes;
};

const deleteAdmin = async (userId) => {
  if (!getAdminById(userId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect id');
  }
  await Token.deleteMany({ user: userId });
  await Admin.findByIdAndRemove(userId);
};

const changeAdminPassword = async (user, oldPassword, newPassword) => {
  const userR = await getAdminById(user._id);
  if (!userR) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!userR || !(await userR.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password');
  }
  try {
    Object.assign(userR, { password: newPassword }, { new: true, useFindAndModify: false });
    await userR.save();
    return userR;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const resetAdminPassword = async (email) => {
  const userR = await getAdminByEmail(email);
  const verificationCode = Math.floor(10000 + Math.random() * 9000);
  console.log('verificationCode', verificationCode);
  if (!userR) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect email');
  }
  try {
    Object.assign(userR, { password: `${verificationCode}@Admin` }, { new: true, useFindAndModify: false });
    await userR.save();
    await emailService.sendResetPassword(email, `${verificationCode}@Admin`);
    return userR;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const resetUserPassword = async (email, user) => {
  if (user.role !== roleTypes.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Just for Admin');
  }
  const userR = await userService.getUserByEmail(email);
  console.log(userR);
  if (!userR) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect email');
  }
  try {
    Object.assign(userR, { password: '123456@User' }, { new: true, useFindAndModify: false });
    await userR.save();
    await emailService.sendResetPassword(email, '123456@User');
    return userR;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const getUserForAdmin = async (user, admin) => {
  let userR;
  let userR2;
  let userR3;
  if (admin.role !== roleTypes.ADMIN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Just for Admin');
  }
  if (user.userId && user.email) {
    userR2 = await userService.getUserById(user.userId);
    userR3 = await userService.getUserByEmail(user.email);
    if (!userR2 || !userR3) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Invalid');
    } else return userR2;
  } else if (user.match(/^[0-9a-fA-F]{24}$/)) {
    userR = await userService.getUserById(user);
    if (!userR) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Invalid');
    }
    return userR;
  } else {
    userR = await userService.getUserByEmail(user);
    if (!userR) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Invalid');
    }
    return userR;
  }
};

const banUser = async (userId) => {
  const userR = await userService.getUserById(userId);
  if (!userR) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found ');
  }
  try {
    if (userR.isBanned === false) {
      Object.assign(userR, { isBanned: true }, { new: true, useFindAndModify: false });
    } else {
      Object.assign(userR, { isBanned: false }, { new: true, useFindAndModify: false });
    }
    await userR.save();
    return userR.isBanned;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Can not block User');
  }
};

//Làm sau vì nếu xoá thì phải check dữ liệu ở quá nhiều bảng => hỏi ))
const deleteUser = async (userId) => {
  const userR = await userService.getUserById(userId);
  if (!userR) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  try {
    // await User.findById(userId).remove().exec();
    const check = await User.findById(userId).exec();
    console.log('checksss', check);
    return;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Can not delete User');
  }
};

module.exports = {
  createAdmin,
  updateAdminById,
  getAdminByEmail,
  loginAdminWithEmailAndPassword,
  deleteAdmin,
  changeAdminPassword,
  resetAdminPassword,
  resetUserPassword,
  getUserForAdmin,
  banUser,
  deleteUser,
};
