const httpStatus = require('http-status');
const codeService = require('./code.service');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const { Code } = require('../models/index');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordCode, newPassword, email) => {
  // try {
  const resetPasswordTokenDoc = await codeService.verifyCodeResetPassword(resetPasswordCode, email);
  const user = await userService.getUserById(resetPasswordTokenDoc.user);
  if (!user) {
    throw new Error();
  }
  await userService.updateUserById(user.id, { password: newPassword });
  await Code.deleteMany({ user: user.id });
  // } catch (error) {
  // throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  // }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken, userId) => {
  try {
    const verifyCodeDoc = await codeService.verifyCode(verifyEmailToken, userId);
    const user = await userService.getUserById(verifyCodeDoc.user);
    if (!user) {
      throw new Error();
    }
    await Code.deleteMany({ user: userId });
    await userService.updateUserById(user.id, { isActivated: true });
  } catch (error) {
    // eslint-disable-next-line prefer-template
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account verification failed' + error);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
