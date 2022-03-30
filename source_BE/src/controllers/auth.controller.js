const httpStatus = require('http-status');
const Verifier = require('email-verifier');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, codeService } = require('../services');

const checkValidEmail = catchAsync(async (req, res) => {
  const verifier = new Verifier('at_FPj6893CCr6sOWxmHpqXEVBQ8qTgg');
  verifier.verify(req.body.email, (err, data) => {
    if (err) throw err;
    res.status(200).send(data.smtpCheck);
  });
});

const register = catchAsync(async (req, res) => {
  // eslint-disable-next-line no-console
  const verifier = new Verifier('at_FPj6893CCr6sOWxmHpqXEVBQ8qTgg');
  verifier.verify(req.body.email, async (err, data) => {
    if (err) throw err;
    let x;
    if (data.smtpCheck === 'true') {
      try {
        const user = await userService.createUser(req.body);
        x = user;
        const tokens = await tokenService.generateAuthTokens(user);
        const verifyCode = await codeService.generateVerifyCode(user);
        await emailService.sendVerificationEmail(user.email, verifyCode);
        res.status(httpStatus.CREATED).send({ user, tokens });
        // eslint-disable-next-line no-shadow
      } catch (err) {
        // eslint-disable-next-line no-console
        if (x === 0) res.status(httpStatus.BAD_REQUEST).send('Subname already taken !');
        else res.status(httpStatus.BAD_REQUEST).send('Email already taken !');
      }
    }
    if (data.smtpCheck === 'false') {
      res.status(httpStatus.NOT_FOUND).send('Email not exists !');
    }
  });
});

// const register = catchAsync(async (req, res) => {
//   // eslint-disable-next-line no-console
//   const user = await userService.createUser(req.body);
//   const tokens = await tokenService.generateAuthTokens(user);
//   res.status(httpStatus.CREATED).send({ user, tokens });
// });

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send('Refresh Token is deleted');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const checkUser = await userService.getUserByEmail(req.body.email);
  const resetPasswordToken = await codeService.generateVerifyCode(checkUser);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send();
});

const verifyToResetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.code, req.body.password, req.body.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyCode = await codeService.generateVerifyCode(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyCode);
  res.status(httpStatus.OK).send('Successfully send code !');
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.params.code, req.user.id);
  res.status(httpStatus.OK).send('Your account successfully activated !');
});

const checktoken = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(req.user);
});

const checkVerifyEmailByToken = catchAsync(async (req, res) => {
  if (!req.user.isActivated) {
    res.status(httpStatus.BAD_REQUEST).send('Account was not activated!');
  }
  res.status(httpStatus.OK).send('Account was activated !');
});

const checkVerifyEmailByEmail = catchAsync(async (req, res) => {
  const check = await userService.getUserByEmail(req.body.email);
  if (check) {
    if (!check.isActivated) {
      res.status(httpStatus.BAD_REQUEST).send('Account was not activated!');
    } else {
      res.status(httpStatus.OK).send('Account was activated !');
    }
  } else {
    res.status(httpStatus.BAD_REQUEST).send('invalid Email !');
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  verifyToResetPassword,
  sendVerificationEmail,
  verifyEmail,
  checktoken,
  checkVerifyEmailByToken,
  checkVerifyEmailByEmail,
  checkValidEmail,
};
