const httpStatus = require('http-status');
const { userService, mediaService } = require('.');
const { User, Search } = require('../models');
const changeName = require('../utils/sort');
const ApiError = require('../utils/ApiError');

const getMess = async (id) => {};

const sendMess = async (id) => {};

const recallMess = async (id) => {};

const deleteRecall = async (id) => {};

const sendLike = async (id) => {};

const sendLove = async (id) => {};

const attachMess = async (id) => {};

const editAttach = async (id) => {};

const deleteAttach = async (id) => {};

module.exports = {
  getMess,
  sendLike,
  sendLove,
  sendMess,
  recallMess,
  deleteRecall,
  attachMess,
  editAttach,
  deleteAttach,
};
