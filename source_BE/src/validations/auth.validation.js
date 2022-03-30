const Joi = require('joi').extend(require('@joi/date')).extend(require('joi-phone-number'));
const { genderTypes } = require('../config/myConfig');
const { birthday, password, objectId, subname } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    fullname: Joi.string().required().min(5).max(30),
    birth: Joi.date().format('DD/MM/YYYY').raw().required().custom(birthday),
    subname: Joi.string().required().min(5).max(18).custom(subname),
    gender: Joi.string().required().valid(genderTypes.FEMALE, genderTypes.MALE, genderTypes.OTHER),
    email: Joi.string().required().email(),
    phone: Joi.string().phoneNumber({ defaultCountry: 'VN', format: 'international' }),
    password: Joi.string().required().custom(password),
  }),
};

const checkEmailValid = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const verifyAccount = {
  params: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  // query: Joi.object().keys({
  //   token: Joi.string().required(),
  // }),
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
    code: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  getUser,
  deleteUser,
  verifyAccount,
  resetPassword,
  refreshTokens,
  forgotPassword,
  checkEmailValid,
};
