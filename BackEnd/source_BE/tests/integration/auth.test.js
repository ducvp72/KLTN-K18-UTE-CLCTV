const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const config = require('../../src/config/config');
const auth = require('../../src/middlewares/auth');
const { tokenService, emailService, codeService } = require('../../src/services');
const ApiError = require('../../src/utils/ApiError');
const setupTestDB = require('../utils/setupTestDB');
const { User, Token, Code } = require('../../src/models');
const { roleRights } = require('../../src/config/roles');
const { tokenTypes } = require('../../src/config/tokens');
const { userOne, admin, insertUsers, userTwo } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

const avar = 'https://res.cloudinary.com/kltn-k18-dl/image/upload/v1645972871/myGallary/defaultAvatar.png.png';

describe('Auth routes', () => {
  /* ----------------------------------- v1-start ----------------------------------- */
  // describe('POST /v1/auth/register', () => {
  //   let newUser;
  //   beforeEach(() => {
  //     newUser = {
  //       fullname: faker.name.findName(),
  //       email: faker.internet.email().toLowerCase(),
  //       password: '123456aR',
  //       birth: '07/02/2000',
  //       gender: 'male',
  //       username: 'a.b.cmd',
  //     };
  //   });
  //   test('should return 201 and successfully register user if request data is ok', async () => {
  //     const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);
  //     expect(res.body.user).not.toHaveProperty('password');
  //     expect(res.body.user).toEqual({
  //       id: expect.anything(),
  //       fullname: newUser.fullname,
  //       email: newUser.email,
  //       role: 'user',
  //       birth: newUser.birth,
  //       createdAt: expect.anything(),
  //       gender: newUser.gender,
  //       username: newUser.username,
  //       isActivated: false,
  //       isBanned: false,
  //       avatar: avar,
  //     });
  //     const dbUser = await User.findById(res.body.user.id);
  //     expect(dbUser).toBeDefined();
  //     expect(dbUser.password).not.toBe(newUser.password);
  //     expect(dbUser).toMatchObject({ fullname: newUser.fullname, email: newUser.email, role: 'user' });
  //     expect(res.body.tokens).toEqual({
  //       access: { token: expect.anything(), expires: expect.anything() },
  //       refresh: { token: expect.anything(), expires: expect.anything() },
  //     });
  //   });
  //   test('should return 400 error if email is invalid', async () => {
  //     newUser.email = 'invalidEmail';
  //     await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  //   });
  //   test('should return 400 error if email is already used', async () => {
  //     await insertUsers([userOne]);
  //     newUser.email = userOne.email;
  //     await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  //   });
  //   test('should return 400 error if password length is less than 8 characters', async () => {
  //     newUser.password = 'passwo1';
  //     await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  //   });
  //   test('should return 400 error if password does not contain both letters and numbers', async () => {
  //     newUser.password = 'password';
  //     await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  //     newUser.password = '11111111';
  //     await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
  //   });
  // });
  // describe('POST /v1/auth/login', () => {
  //   test('should return 200 and login user if email and password match', async () => {
  //     await insertUsers([userOne]);
  //     const loginCredentials = {
  //       email: userOne.email,
  //       password: userOne.password,
  //     };
  //     const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);
  //     expect(res.body.user).toEqual({
  //       id: expect.anything(),
  //       fullname: userOne.fullname,
  //       email: userOne.email,
  //       role: 'user',
  //       birth: userOne.birth,
  //       createdAt: expect.anything(),
  //       gender: userOne.gender,
  //       username: userOne.username,
  //       isActivated: false,
  //       isBanned: false,
  //       avatar: avar,
  //     });
  //     expect(res.body.tokens).toEqual({
  //       access: { token: expect.anything(), expires: expect.anything() },
  //       refresh: { token: expect.anything(), expires: expect.anything() },
  //     });
  //   });
  //   test('should return 401 error if there are no users with that email', async () => {
  //     const loginCredentials = {
  //       email: userOne.email,
  //       password: userOne.password,
  //     };
  //     const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
  //     expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect email or password' });
  //   });
  //   test('should return 401 error if password is wrong', async () => {
  //     await insertUsers([userOne]);
  //     const loginCredentials = {
  //       email: userOne.email,
  //       password: 'wrongPassword1',
  //     };
  //     const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
  //     expect(res.body).toEqual({ code: httpStatus.UNAUTHORIZED, message: 'Incorrect email or password' });
  //   });
  // });
  // describe('POST /v1/auth/send-to-forgot-password', () => {
  //   beforeEach(() => {
  //     jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
  //   });
  //   test('should return 204 and send code to reset email to the user', async () => {
  //     await insertUsers([userOne]);
  //     const sendResetPasswordEmailSpy = jest.spyOn(emailService, 'sendResetPasswordEmail');
  //     await request(app).post('/v1/auth/send-to-forgot-password').send({ email: userOne.email }).expect(httpStatus.OK);
  //     expect(sendResetPasswordEmailSpy).toHaveBeenCalledWith(userOne.email, expect.anything());
  //     const resetPasswordToken = sendResetPasswordEmailSpy.mock.calls[0][1];
  //     const dbResetPasswordTokenDoc = await Token.findOne({ token: resetPasswordToken, user: userOne._id });
  //     expect(dbResetPasswordTokenDoc).toBeDefined();
  //   });
  //   test('should return 400 if email is missing', async () => {
  //     await insertUsers([userOne]);
  //     await request(app).post('/v1/auth/send-to-forgot-password').send('Nothing').expect(httpStatus.BAD_REQUEST);
  //   });
  //   test('should return 404 if email does not belong to any user', async () => {
  //     await insertUsers([userOne]);
  //     await request(app).post('/v1/auth/send-to-forgot-password').send({ email: 'test@gmail.com' }).expect(httpStatus.OK);
  //   });
  // });
  // describe('POST /v1/auth/reset-password', () => {
  //   test('should return 200 and code to change password', async () => {
  //     await insertUsers([userOne]);
  //     const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  //     const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await request(app)
  //       .post('/v1/auth/reset-password')
  //       .query({ token: resetPasswordToken })
  //       .send({ password: 'password2', code: '12345' })
  //       .expect(httpStatus.OK);
  //     const dbUser = await User.findById(userOne._id);
  //     const isPasswordMatch = await bcrypt.compare('password2', dbUser.password);
  //     expect(isPasswordMatch).toBe(true);
  //     const dbResetPasswordTokenCount = await Token.countDocuments({ user: userOne._id, type: tokenTypes.RESET_PASSWORD });
  //     expect(dbResetPasswordTokenCount).toBe(0);
  //   });
  //   test('should return 400 if reset password token is missing', async () => {
  //     await insertUsers([userOne]);
  //     await request(app).post('/v1/auth/reset-password').send({ password: 'password2' }).expect(httpStatus.BAD_REQUEST);
  //   });
  //   test('should return 401 if reset password token is expired', async () => {
  //     await insertUsers([userOne]);
  //     const expires = moment().subtract(1, 'minutes');
  //     const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await request(app)
  //       .post('/v1/auth/reset-password')
  //       .query({ token: resetPasswordToken })
  //       .send({ password: 'password2' })
  //       .expect(httpStatus.UNAUTHORIZED);
  //   });
  //   test('should return 401 if user is not found', async () => {
  //     const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  //     const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await request(app)
  //       .post('/v1/auth/reset-password')
  //       .query({ token: resetPasswordToken })
  //       .send({ password: 'password2' })
  //       .expect(httpStatus.UNAUTHORIZED);
  //   });
  //   test('should return 400 if password is missing or invalid', async () => {
  //     await insertUsers([userOne]);
  //     const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  //     const resetPasswordToken = tokenService.generateToken(userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await tokenService.saveToken(resetPasswordToken, userOne._id, expires, tokenTypes.RESET_PASSWORD);
  //     await request(app).post('/v1/auth/reset-password').query({ token: resetPasswordToken }).expect(httpStatus.BAD_REQUEST);
  //     await request(app)
  //       .post('/v1/auth/reset-password')
  //       .query({ token: resetPasswordToken })
  //       .send({ password: 'short1' })
  //       .expect(httpStatus.BAD_REQUEST);
  //     await request(app)
  //       .post('/v1/auth/reset-password')
  //       .query({ token: resetPasswordToken })
  //       .send({ password: 'password' })
  //       .expect(httpStatus.BAD_REQUEST);
  //     await request(app)
  //       .post('/v1/auth/reset-password')
  //       .query({ token: resetPasswordToken })
  //       .send({ password: '11111111' })
  //       .expect(httpStatus.BAD_REQUEST);
  //   });
  // });
  /* ----------------------------------- v1-end ----------------------------------- */
  // describe('POST /v1/auth/verify-email/:code', () => {
  //   test('should return 204 and verify the email', async () => {
  //     await insertUsers([userOne]);
  //     // const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  //     const verifyEmailCode = await codeService.generateVerifyCode(userOne._id);
  //     // await codeService.saveCode(verifyEmailCode, userOne._id, expires);
  //     await request(app)
  //       .post(`/v1/auth/verify-email/${verifyEmailCode}`)
  //       .set('Authorization', `Bearer ${userOneAccessToken}`)
  //       .send()
  //       .expect(httpStatus.OK);
  //     const dbUser = await User.findById(userOne._id);
  //     expect(dbUser.isActivated).toBe(true);
  //     const dbVerifyEmailToken = await Code.countDocuments({
  //       user: userOne._id,
  //       type: tokenTypes.VERIFY_EMAIL,
  //     });
  //     expect(dbVerifyEmailToken).toBe(0);
  //   });
  //   test('should return 400 if verify email token is missing', async () => {
  //     await insertUsers([userOne]);
  //     await request(app)
  //       .post('/v1/auth/verify-email:code')
  //       .set('Authorization', `Bearer ${userOneAccessToken}`)
  //       .send()
  //       .expect(httpStatus.NOT_FOUND);
  //   });
  //   test('should return 401 if verify email token is expired', async () => {
  //     await insertUsers([userOne]);
  //     // const expires = moment().subtract(1, 'minutes');
  //     const verifyEmailCode = await codeService.generateVerifyCode(userOne._id);
  //     await request(app)
  //       .post(`/v1/auth/verify-email/${verifyEmailCode}`)
  //       .set('Authorization', `Bearer ${userOneAccessToken}`)
  //       .send()
  //       .expect('Your account successfully activated !');
  //   });
  //   test('should return 401 if user is not found', async () => {
  //     const verifyEmailCode = codeService.generateVerifyCode(userOne._id);
  //     await request(app).post(`/v1/auth/verify-email/${verifyEmailCode}`).send().expect(httpStatus.UNAUTHORIZED);
  //   });
  // });
  // describe('POST /v1/auth/send-verification-email', () => {
  //   beforeEach(() => {
  //     jest.spyOn(emailService.transport, 'sendMail').mockResolvedValue();
  //   });
  //   test('should return 204 and send verification email to the user', async () => {
  //     await insertUsers([userOne]);
  //     const sendVerificationEmailSpy = jest.spyOn(emailService, 'sendVerificationEmail');
  //     await request(app)
  //       .post('/v1/auth/send-verification-email')
  //       .set('Authorization', `Bearer ${userOneAccessToken}`)
  //       .expect(httpStatus.OK);
  //     expect(sendVerificationEmailSpy).toHaveBeenCalledWith(userOne.email, expect.anything());
  //     const verifyEmailToken = sendVerificationEmailSpy.mock.calls[0][1];
  //     const dbVerifyEmailToken = await Token.findOne({ token: verifyEmailToken, user: userOne._id });
  //     expect(dbVerifyEmailToken).toBeDefined();
  //   });
  //   test('should return 401 error if access token is missing', async () => {
  //     await insertUsers([userOne]);
  //     await request(app).post('/v1/auth/send-verification-email').send().expect(httpStatus.UNAUTHORIZED);
  //   });
  // });
});

// describe('Auth middleware', () => {
//   test('should call next with no errors if access token is valid', async () => {
//     await insertUsers([userOne]);
//     const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith();
//     expect(req.user._id).toEqual(userOne._id);
//   });

//   test('should call next with unauthorized error if access token is not found in header', async () => {
//     await insertUsers([userOne]);
//     const req = httpMocks.createRequest();
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(
//       expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
//     );
//   });

//   test('should call next with unauthorized error if access token is not a valid jwt token', async () => {
//     await insertUsers([userOne]);
//     const req = httpMocks.createRequest({ headers: { Authorization: 'Bearer randomToken' } });
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(
//       expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
//     );
//   });

//   test('should call next with unauthorized error if the token is not an access token', async () => {
//     await insertUsers([userOne]);
//     const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//     const refreshToken = tokenService.generateToken(userOne._id, expires, tokenTypes.REFRESH);
//     const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${refreshToken}` } });
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(
//       expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
//     );
//   });

//   test('should call next with unauthorized error if access token is generated with an invalid secret', async () => {
//     await insertUsers([userOne]);
//     const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//     const accessToken = tokenService.generateToken(userOne._id, expires, tokenTypes.ACCESS, 'invalidSecret');
//     const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${accessToken}` } });
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(
//       expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
//     );
//   });

//   test('should call next with unauthorized error if access token is expired', async () => {
//     await insertUsers([userOne]);
//     const expires = moment().subtract(1, 'minutes');
//     const accessToken = tokenService.generateToken(userOne._id, expires, tokenTypes.ACCESS);
//     const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${accessToken}` } });
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(
//       expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
//     );
//   });

//   test('should call next with unauthorized error if user is not found', async () => {
//     const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
//     const next = jest.fn();

//     await auth()(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(
//       expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, message: 'Please authenticate' })
//     );
//   });

//   test('should call next with forbidden error if user does not have required rights and userId is not in params', async () => {
//     await insertUsers([userOne]);
//     const req = httpMocks.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
//     const next = jest.fn();

//     await auth('anyRight')(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith(expect.any(ApiError));
//     expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: httpStatus.FORBIDDEN, message: 'Forbidden' }));
//   });

//   test('should call next with no errors if user does not have required rights but userId is in params', async () => {
//     await insertUsers([userOne]);
//     const req = httpMocks.createRequest({
//       headers: { Authorization: `Bearer ${userOneAccessToken}` },
//       params: { userId: userOne._id.toHexString() },
//     });
//     const next = jest.fn();

//     await auth('anyRight')(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith();
//   });

//   test('should call next with no errors if user has required rights', async () => {
//     await insertUsers([admin]);
//     const req = httpMocks.createRequest({
//       headers: { Authorization: `Bearer ${adminAccessToken}` },
//       params: { userId: userOne._id.toHexString() },
//     });
//     const next = jest.fn();

//     await auth(...roleRights.get('admin'))(req, httpMocks.createResponse(), next);

//     expect(next).toHaveBeenCalledWith();
//   });
// });
