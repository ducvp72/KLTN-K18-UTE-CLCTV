const httpStatus = require('http-status');
const { userService } = require('.');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const findProfileById = async (id) => {
  let userRes;
  await User.findById(id).then((user) => {
    if (!user) throw ApiError(httpStatus.NOT_FOUND, 'User invalid !');
    userRes = user;
  });
  // console.log(userRes);
  return userRes;
};

const updateProfile = async (user, userN) => {
  let userRes;

  await User.findByIdAndUpdate(
    user.id,
    {
      fullname: userN.fullname,
      birth: userN.birth,
      gender: userN.gender,
    },
    { new: true, useFindAndModify: false }
  )
    .then((updateUser) => {
      userRes = updateUser;
      console.log(userRes);
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });

  return userRes;
};

const resetPassword = async (user, oldPassword, newPassword) => {
  const userR = await userService.getUserById(user._id);
  console.log(userR);
  if (!userR || !(await userR.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password');
  }
  try {
    await userService.updateUserById(user._id, { password: newPassword }, { new: true, useFindAndModify: false });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

module.exports = {
  findProfileById,
  updateProfile,
  resetPassword,
};
