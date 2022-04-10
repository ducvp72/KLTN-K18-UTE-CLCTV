const httpStatus = require('http-status');
const { userService, mediaService } = require('.');
const { User, Search } = require('../models');
const changeName = require('../utils/sort');
const ApiError = require('../utils/ApiError');

const sendLike = async (id) => {};

const sendLove = async (id) => {};

const sendMess = async (id) => {};

const recallMess = async (id) => {};

const deleteMess = async (id) => {};

const attachMess = async (id) => {};

const editAttach = async (id) => {};

const deleteAttach = async (id) => {};

module.exports = {
  sendLike,
  sendLove,
  sendMess,
  recallMess,
  deleteMess,
  attachMess,
  editAttach,
  deleteAttach,
};
