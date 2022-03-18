const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { profileService, mediaService } = require('../services');

const changeAvatar = catchAsync(async (req, res) => {
  const kq = await mediaService.uploadImage(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const findProfileById = catchAsync(async (req, res) => {
  const userProfile = await profileService.findProfileById(req.params.id);
  res.status(httpStatus.OK).send(userProfile);
});

const changeProfile = catchAsync(async (req, res) => {
  const newProfile = await profileService.updateProfile(req.user, req.body);
  res.status(httpStatus.OK).send(newProfile);
});

const resetPassword = catchAsync(async (req, res) => {
  console.log('ok');
  await profileService.resetPassword(req.user, req.body.oldPassword, req.body.password);
  res.status(httpStatus.OK).send('Your password is updated');
});

module.exports = {
  findProfileById,
  changeProfile,
  changeAvatar,
  resetPassword,
};
