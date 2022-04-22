const Joi = require('joi').extend(require('@joi/date')).extend(require('joi-phone-number'));
const { password, objectId, phone } = require('./custom.validation');

const createAdmin = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().required().min(5),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().max(5),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const getAdmins = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAdmin = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUserForAdmin = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    email: Joi.string().custom(objectId),
  }),
};

const getUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateAdmin = {
  body: Joi.object().keys({
    fullname: Joi.string().required().min(5).max(30),
    // phone: Joi.string().required().phoneNumber({ defaultCountry: 'VN', format: 'international' }),
    phone: Joi.string().required().custom(phone),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required().custom(password),
    password: Joi.string().required().custom(password),
  }),
};

const defaultPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().min(5),
  }),
};

const defaultPasswordUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const deleteAdmin = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const sortListUser = {
  query: Joi.object().keys({
    key: Joi.string().allow(null).allow(''),
    fullname: Joi.string().allow(null).allow(''),
    email: Joi.string().allow(null).allow(''),
    username: Joi.string().allow(null).allow(''),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
  resetPassword,
  defaultPassword,
  defaultPasswordUser,
  getUserForAdmin,
  getUserId,
  sortListUser,
};
