/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { userService, mediaService, groupService } = require('.');
const { User, Search, Message, Group, UserGroup } = require('../models');
const changeName = require('../utils/sort');
const ApiError = require('../utils/ApiError');
const { fileTypes, files } = require('../config/fileTypes');

const autoUpdateDate = async (groupId) => {
  try {
    await Group.updateOne({ _id: groupId }, { updatedAt: new Date() });
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const checkMem = async (userId, groupId) => {
  const value = { groupId, userId };
  const checkMember = await groupService.checkMember(value);
  if (!checkMember) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You must be member of group');
  }
};

const getMess = async (userId, groupId, options) => {
  await checkMem(userId, groupId);
  try {
    let messages;
    options.populate = 'sender';
    if (options.typeMessage) {
      if (options.typeMessage === 'MEDIA') options.typeMessage = ['IMAGE', 'VIDEO', 'AUDIO'];
      const { typeMessage } = options;
      messages = await Message.paginate({ groupId, typeMessage }, options);
    } else {
      messages = await Message.paginate({ groupId }, options);
    }

    return messages;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const getListMess = async (user, filter, options) => {
  console.log(filter, options, user.id);
  // const findGroup = await Group.find().populate('last');
  // console.log(findGroup);
  const find = await UserGroup.find({ member: user.id }).populate({
    path: 'admin',
  });
  const myGroup = find.map((item) => item.groupId);
  const rs = await Group.paginateLast(myGroup, filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = rs;
  for (const item of rs.results) {
    results.push(item);
  }
  return results;
};

const sendMess = async (user, req) => {
  await checkMem(user.id, req.groupId);
  let messN;
  try {
    const newM = await Message.create({
      groupId: req.groupId,
      sender: user.id,
      typeMessage: fileTypes.TEXT,
      text: req.text,
    });
    await autoUpdateDate(req.groupId);
    messN = newM;
  } catch (err) {
    console.log(err);
  }

  await Group.findByIdAndUpdate(req.groupId, {
    last: messN.id,
  });

  const find = await Message.findById(messN._id).populate({
    path: 'sender',
    select: 'fullname avatar',
  });

  return find;
};

const getDowladFile = async (user, file, req) => {
  await checkMem(user.id, req.groupId);
};

const recallMess = async (user, req) => {
  await checkMem(user.id, req.groupId);
  const find = await Message.findById(req.messId).populate('sender');
  try {
    await Message.findByIdAndUpdate(req.messId, {
      typeMessage: fileTypes.RECALL,
      text: `Message was remove by ${find.fullname}`,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteRecall = async (user, req) => {
  await checkMem(user.id, req.groupId);
  try {
    await Message.findOneAndRemove({ _id: req.messId, groupId: req.groupId });
  } catch (err) {
    console.log(err);
  }
};

const sendLike = async (user, req) => {
  await checkMem(user.id, req.groupId);
  let messN;
  try {
    const newM = await Message.create({
      groupId: req.groupId,
      sender: user.id,
      typeMessage: fileTypes.LIKE,
    });
    await autoUpdateDate(req.groupId);
    messN = newM;
  } catch (err) {
    console.log(err);
  }
  return messN;
};

const sendLove = async (user, req) => {
  await checkMem(user.id, req.groupId);
  let messN;
  try {
    const newM = await Message.create({
      groupId: req.groupId,
      sender: user.id,
      typeMessage: fileTypes.LOVE,
    });
    await autoUpdateDate(req.groupId);
    messN = newM;
  } catch (err) {
    console.log(err);
  }
  return messN;
};

const getLastMess = async (user, groupId) => {
  // await checkMem(user.id, groupId);

  const lastMessage = await Message.findOne({
    groupId,
  })
    .populate('sender')
    .sort({ createdAt: -1 });

  return lastMessage;
};

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
  getLastMess,
  getDowladFile,
  autoUpdateDate,
  getListMess,
};
