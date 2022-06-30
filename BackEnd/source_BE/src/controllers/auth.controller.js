const httpStatus = require('http-status');
const random = require('random-name');
const Verifier = require('email-verifier');
const catchAsync = require('../utils/catchAsync');
const changeName = require('../utils/sort');
const { authService, userService, tokenService, emailService, codeService } = require('../services');

const checkValidEmail = catchAsync(async (req, res) => {
  const verifier = new Verifier('at_FPj6893CCr6sOWxmHpqXEVBQ8qTgg');
  verifier.verify(req.body.email, (err, data) => {
    if (err) throw err;
    res.status(200).send(data.smtpCheck);
  });
});

// const register = catchAsync(async (req, res) => {
//   // eslint-disable-next-line no-console
//   const verifier = new Verifier('at_FPj6893CCr6sOWxmHpqXEVBQ8qTgg');
//   verifier.verify(req.body.email, async (err, data) => {
//     if (err) throw err;
//     let qr;
//     const user = await userService.createUser(req.body);
//     if (data.smtpCheck === 'true') {
//       await user.tempQR
//         // eslint-disable-next-line no-shadow
//         .then((res) => {
//           qr = res;
//         })
//         // eslint-disable-next-line no-shadow
//         .catch((err) => {
//           // eslint-disable-next-line no-console
//           console.log(err);
//         });

//       const tokens = await tokenService.generateAuthTokens(user);
//       const verifyCode = await codeService.generateVerifyCode(user);
//       await emailService.sendVerificationEmail(user.email, verifyCode);
//       res.status(httpStatus.CREATED).send({ user, tokens, qr });
//     }
//     if (data.smtpCheck === 'false') {
//       res.status(httpStatus.NOT_FOUND).send('Email not exists !');
//     }
//   });
// });

const register = catchAsync(async (req, res) => {
  // eslint-disable-next-line no-console
  let qr;
  const user = await userService.createUser(req.body);

  await user.tempQR
    // eslint-disable-next-line no-shadow
    .then((res) => {
      qr = res;
    })
    // eslint-disable-next-line no-shadow
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });

  const tokens = await tokenService.generateAuthTokens(user);
  const verifyCode = await codeService.generateVerifyCode(user);
  await emailService.sendVerificationEmail(user.email, verifyCode);
  res.status(httpStatus.CREATED).send({ user, tokens, qr });
  // eslint-disable-next-line no-shadow
});

const randomDate = (start, end) => {
  // eslint-disable-next-line one-var
  let d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
};

const cloneUser = catchAsync(async (req, res) => {
  // eslint-disable-next-line no-plusplus
  const genderArr = ['male', 'female', 'other'];
  // const randome = Math.floor(Math.random() * 1000);
  const fakename = random();
  const temp = await changeName(fakename);
  const element = temp.split(' ');
  const userClone = {
    // fullname: `fullname${randome}`,
    fullname: `${fakename}`,
    birth: randomDate(new Date(2022, 0, 1), new Date()),
    isActivated: true,
    // eslint-disable-next-line no-bitwise
    gender: genderArr[(Math.random() * genderArr.length) | 0],
    username: `${element[1]}.${element[0]}`,
    email: `${element[1]}${element[0]}@gmail.com`,
    password: '123456@User',
  };
  const user = await userService.createUser(userClone);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  let qr;
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  await user.tempQR
    // eslint-disable-next-line no-shadow
    .then((res) => {
      qr = res;
    })
    // eslint-disable-next-line no-shadow
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
  res.send({ user, tokens, qr });
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
  cloneUser,
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
