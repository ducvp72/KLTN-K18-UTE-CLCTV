const moment = require('moment');
const httpStatus = require('http-status');
const userService = require('./user.service');
const { Code, User } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

/**
 * Save a token
 * @param {string} code
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveCode = async (code, userId, expires, blacklisted = false) => {
  const codeDoc = await Code.create({
    code,
    user: userId,
    expires: expires.toDate(),
    blacklisted,
  });
  return codeDoc;
};

const saveCodeGroup = async (code, group, expires, blacklisted = false) => {
  const codeDoc = await Code.create({
    code,
    group,
    expires: expires.toDate(),
    blacklisted,
  });
  return codeDoc;
};

const verifyCode = async (code, user) => {
  const codeDoc = await Code.findOne({ code, user, blacklisted: false });
  const countExpire = codeDoc.expires - Date.now();
  // eslint-disable-next-line no-console
  if (countExpire <= 0) {
    throw new Error('Code expired');
  }
  if (!codeDoc) {
    throw new Error('Code not found');
  }
  return codeDoc;
};

const verifyCodeResetPassword = async (code, email) => {
  const user = await User.findOne({ email });

  const codeDoc = await Code.findOne({ code, user: user._id, blacklisted: false });
  const countExpire = codeDoc.expires - Date.now();
  // eslint-disable-next-line no-console
  if (countExpire <= 0) {
    throw new Error('Code expired');
  }
  if (!codeDoc) {
    throw new Error('Code not found');
  }
  return codeDoc;
};

const verifyCodeJoinGroup = async (code, group) => {
  const codeDoc = await Code.findOne({ code, group, blacklisted: false });
  if (!codeDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code expired');
  }
  const countExpire = codeDoc.expires - Date.now();
  // eslint-disable-next-line no-console
  if (countExpire <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code expired');
  }

  return codeDoc;
};

/**
 * Generate verify email code
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyCode = async (user) => {
  const expires = moment().add(config.code.verifyExpirationMinutes, 'minutes');
  const verificationCode = Math.floor(10000 + Math.random() * 9000);
  await saveCode(verificationCode, user, expires);
  return verificationCode;
};

const generateVerifyCodeGroup = async (group) => {
  const expires = moment().add(config.code.verifyExpirationMinutesGroup, 'minutes');
  const verificationCode = Math.floor(10000 + Math.random() * 9000);
  await saveCodeGroup(verificationCode, group, expires);
  return verificationCode;
};

module.exports = {
  saveCode,
  verifyCode,
  generateVerifyCode,
  verifyCodeResetPassword,
  generateVerifyCodeGroup,
  verifyCodeJoinGroup,
};
