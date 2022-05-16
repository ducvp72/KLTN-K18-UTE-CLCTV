const httpStatus = require('http-status');

const { User, Search, Friend, WaitingFriend } = require('../models');
const changeName = require('../utils/sort');
const ApiError = require('../utils/ApiError');

const getUserAll = async () => {
  return User.find({});
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken !');
  }
  if (await User.isusernameTaken(userBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'username already taken !');
  }
  const user = await User.create(userBody);
  const name = await changeName(user.fullname);
  await Search.create({ user, subname: name, username: userBody.username, email: userBody.email });
  return user;
};

// const queryUsers = async (filter, options) => {
//   const { fullname, email } = filter;

//   if (email) {
//     // eslint-disable-next-line no-param-reassign
//     filter.email = { $regex: email.trim() || '', $options: 'i' };
//   }

//   if (fullname) {
//     const find = await changeName(filter.fullname);
//     // eslint-disable-next-line no-param-reassign
//     filter.fullname = { $regex: find || '', $options: 'i' };
//   }

//   const users = await User.paginate(filter, options);
//   return users;
// };

const queryUsers = async (filter, options) => {
  if (filter.key) {
    // eslint-disable-next-line no-param-reassign
    filter.key = await changeName(filter.key);
  }
  const users = await Search.paginateAdmin(filter, options);
  // const results = [];
  // const { page, limit, totalPages, totalResults } = users;
  // eslint-disable-next-line no-restricted-syntax
  // totalResults = totalResults - 1;
  // eslint-disable-next-line no-restricted-syntax
  // for (const item of users.results) {
  //   const newUser = {};
  //   const userId = item.user.id;
  //   // eslint-disable-next-line prefer-destructuring
  //   const username = item.username;
  //   // eslint-disable-next-line prefer-destructuring
  //   const fullname = item.user.fullname;
  //   // eslint-disable-next-line prefer-destructuring
  //   const email = item.user.email;
  //   // eslint-disable-next-line prefer-destructuring
  //   const avatar = item.user.avatar;
  //   results.push(Object.assign(newUser, { userId, fullname, username, avatar, email }));
  // }
  return users;
};

const queryUsersClient = async (userR, filter, options) => {
  const find = await Search.findOne({ user: userR.id }).populate({ path: 'user' });
  if (filter.key) {
    // eslint-disable-next-line no-param-reassign
    filter.key = await changeName(filter.key);
  }
  const users = await Search.paginateClient(find, filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = users;
  // eslint-disable-next-line no-restricted-syntax
  // totalResults = totalResults - 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of users.results) {
    const newUser = {};
    const userId = item.user.id;
    // eslint-disable-next-line prefer-destructuring
    const username = item.username;
    // eslint-disable-next-line prefer-destructuring
    const fullname = item.user.fullname;
    // eslint-disable-next-line prefer-destructuring
    const email = item.user.email;
    // eslint-disable-next-line prefer-destructuring
    const avatar = item.user.avatar;
    // eslint-disable-next-line no-await-in-loop
    const isFriend = await isFriendN(userR.id, userId);
    // console.log(isFriend);
    results.push(Object.assign(newUser, { userId, fullname, username, avatar, email, isFriend }));
  }
  return { results, page, limit, totalPages, totalResults };
};

const isFriendN = async (userId, friendId) => {
  // console.log('checkFriend', userId, '/n', friendId);
  let find = 0;
  const checkFriend = await Friend.findOne({ user: userId, friends: friendId });
  const checkWaitingOther = await WaitingFriend.findOne({ user: friendId, waitingFriends: userId });
  const checkWaitingMine = await WaitingFriend.findOne({ user: userId, waitingFriends: friendId });
  if (checkFriend) {
    //Bạn hay chưa với nó
    find = 1;
  } else if (checkWaitingOther) {
    //Mình có trong danh sách chờ kết bạn của nó không
    find = 2;
  } else if (checkWaitingMine) {
    //Nó có trong danh sách chờ kết bạn của mình không
    find = 3;
  } else find = 0;
  return find;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  getUserAll,
  createUser,
  queryUsers,
  queryUsersClient,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
