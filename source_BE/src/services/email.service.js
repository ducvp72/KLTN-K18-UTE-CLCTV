const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  const a = await transport.sendMail(msg);
  console.log(a);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, code) => {
  const subject = 'Reset Password';
  // replace this url with the link to the email verification page of your front-end app
  const text = `<h3 style="color: #1000b5">Dear user, welcome to MM App ! </h3><br/>This is your verification code to reset password:  <span style=" font-weight: bold; text-decoration: underline; font-size: 25px; color: #f70000">${code}</span></h3> <br/> <h4 style="color: #f70000">Warning: Do not sharing for anybody !</h4> `;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email code
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, code) => {
  console.log('Check gui mail ne');
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const text = `<h3 style="color: #1000b5">Dear user, welcome to MM App ! </h3><br/>This is your verification code:  <span style=" font-weight: bold; text-decoration: underline; font-size: 25px; color: #f70000">${code}</span></h3> <br/> <h4 style="color: #f70000">Warning: Do not sharing for anybody !</h4> `;
  const check = await sendEmail(to, subject, text);
  console.log('Check gui mail', check);
};

/**
 * Send verification email code
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPassword = async (to, resetPass) => {
  const subject = 'Your Reset Password';
  // replace this url with the link to the email verification page of your front-end app
  const text = `<h3 style="color: #1000b5">Dear user, welcome to MM App ! </h3><br/>This is your reset Password:  <span style=" font-weight: bold; text-decoration: underline; font-size: 25px; color: #f70000">${resetPass}</span></h3> <br/> <h4 style="color: #f70000">Warning: Do not sharing for anybody !</h4> `;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendResetPassword,
};
