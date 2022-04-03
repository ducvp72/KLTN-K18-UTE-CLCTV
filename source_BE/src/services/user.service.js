const httpStatus = require('http-status');
const { User, Search, Friend } = require('../models');
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
    // throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken !');
    return 1;
  }
  if (await User.isSubNameTaken(userBody.subname)) {
    // throw new ApiError(httpStatus.BAD_REQUEST, 'Subname already taken !');
    return 0;
  }
  const user = await User.create(userBody);
  const name = await changeName(user.fullname);
  await Search.create({ fullname: name, user, subname: userBody.subname, email: userBody.email });
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const { fullname, email } = filter;

  if (email) {
    // eslint-disable-next-line no-param-reassign
    filter.email = { $regex: email.trim() || '', $options: 'i' };
  }

  if (fullname) {
    const find = await changeName(filter.fullname);
    // eslint-disable-next-line no-param-reassign
    filter.fullname = { $regex: find || '', $options: 'i' };
  }

  const users = await User.paginate(filter, options);
  return users;
};

const isFriendN = async (userId, friendId) => {
  console.log('checkFriend', userId, '/n', friendId);
  let find = false;
  const checkWaitingFriend = await Friend.findOne({ user: userId, friends: friendId });
  const checkWaitingFriend2 = await Friend.findOne({ user: userId, friends: friendId });

  console.log('find', checkWaitingFriend2);
  if (checkWaitingFriend) {
    find = true;
    console.log('find2');
  }
  return find;
};

const queryUsersClient = async (user, filter, options) => {
  console.log('filter', filter);
  console.log('options', options);

  if (filter.key) {
    // eslint-disable-next-line no-param-reassign
    filter.key = await changeName(filter.key);
  }
  const users = await Search.paginateClient(filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = users;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of users.results) {
    const newUser = {};
    const { fullname, subname } = item;
    const userId = item.user.id;
    const realName = item.user.fullname;
    const avatar = item.user.avatar;
    const isFriend = await isFriendN(user.id, userId);
    console.log(isFriend);
    results.push(Object.assign(newUser, { userId, fullname, realName, subname, avatar, isFriend }));
  }
  return { results, page, limit, totalPages, totalResults };
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
