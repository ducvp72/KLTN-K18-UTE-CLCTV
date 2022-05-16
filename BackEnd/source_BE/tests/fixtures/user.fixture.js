const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/models/user.model');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  fullname: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  gender: 'male',
  username: 'lam.bui',
  birth: '07/02/2000',
  avatar: 'https://res.cloudinary.com/kltn-k18-dl/image/upload/v1645972871/myGallary/defaultAvatar.png.png',
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  fullname: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  gender: 'male',
  username: 'lam.bui2',
  birth: '07/03/2000',
  avatar: 'https://res.cloudinary.com/kltn-k18-dl/image/upload/v1645972871/myGallary/defaultAvatar.png.png',
  isActivated: false,
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
