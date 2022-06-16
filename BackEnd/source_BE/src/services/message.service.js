/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { Message, Group, UserGroup } = require('../models');
const ApiError = require('../utils/ApiError');
const { fileTypes } = require('../config/fileTypes');
// const { checkMember } = require('./group.service');
const config = require('../config/config');

// const checkMem = async (userId, groupId) => {
//   const value = { groupId, userId };
//   const checkM = await checkMember(value);
//   if (!checkM) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'You must be member of group');
//   }
// };

const autoUpdateDate = async (groupId) => {
  try {
    await Group.updateOne({ _id: groupId }, { updatedAt: new Date() });
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const getMess = async (userId, groupId, options) => {
  // await checkMem(userId, groupId);
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
  // const findGroup = await Group.find().populate('last');
  // console.log(findGroup);
  const find = await UserGroup.find({ member: user.id }).populate({
    path: 'admin',
  });
  const myGroup = find.map((item) => item.groupId);
  // eslint-disable-next-line no-console
  console.log('MY GROUP', myGroup);
  const rs = await Group.paginateLast(myGroup, filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = rs;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of rs.results) {
    if (item.groupType === 'personal' || item.groupType === 'public') {
      // eslint-disable-next-line no-await-in-loop
      const check = await UserGroup.find({ groupId: item._id }).populate({ path: 'member' });
      // item.member = check.member;
      const list = check.map((x) => x.member);
      item.member = list;
    }
    results.push(item);
  }
  // return { results, page, limit, totalPages, totalResults };
  return results;
};

const generateMessage = (userId, groupId, message, secret = config.jwt.secret) => {
  const payload = {
    sub: message,
    groupId,
    userId,
  };
  return jwt.sign(payload, secret);
};

const decodeMessage = async (message) => {
  const payload = jwt.verify(message, config.jwt.secret);
  // const tokenDoc = await Message.findOne({ message, user: payload.sub, blacklisted: false });
  // if (!tokenDoc) {
  //   throw new Error('Token not found');
  // }
  // return tokenDoc;
  return payload;
};

const checkTosee = async (member, groupId) => {
  const check = await UserGroup.findOne({ member, groupId });
  if (check) {
    console.log('Checkkkkkkkkkkkkkkkkkk', check);
  } else {
    console.warn('You not allow to see message');
  }
};

const sendMess = async (user, req) => {
  // await checkMem(user.id, req.groupId);
  // const hashMess = generateMessage(user.id, req.groupId, req.text);
  // console.log('hash', hashMess);
  // const decode = await decodeMessage(hashMess);
  // console.log('decode', decode.sub);
  let m;
  try {
    m = new Message({
      groupId: req.groupId,
      sender: user.id,
      typeMessage: fileTypes.TEXT,
      text: req.text,
      typeId: -1,
    });
    await autoUpdateDate(req.groupId);
    await Group.findByIdAndUpdate(req.groupId, {
      last: m.id,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return m.save().then((item) =>
    item
      .populate({
        path: 'sender',
        select: 'fullname avatar',
      })
      .execPopulate()
  );

  // let messN, newM;
  // try {
  //   newM = await Message.create({
  //     groupId: req.groupId,
  //     sender: user.id,
  //     typeMessage: fileTypes.TEXT,
  //     text: req.text,
  //     typeId: req.typeId,
  //   }).populate({
  //     path: 'sender',
  //     select: 'fullname avatar',
  //   });
  //   await autoUpdateDate(req.groupId);
  //   messN = newM;
  // } catch (err) {
  //   console.log(err);
  // }

  // await Group.findByIdAndUpdate(req.groupId, {
  //   // last: messN.id,
  //   last: newM.id,
  // });

  // const find = await Message.findById(messN._id).populate({
  //   path: 'sender',
  //   select: 'fullname avatar',
  // });

  // return newM;
};

const sendMessHT = async (user, req) => {
  // await checkMem(user.id, req.groupId);
  // const hashMess = generateMessage(user.id, req.groupId, req.text);
  // console.log('hash', hashMess);
  // const decode = await decodeMessage(hashMess);
  // console.log('decode', decode.sub);
  let m;
  try {
    m = new Message({
      groupId: req.groupId,
      sender: user.id,
      typeMessage: fileTypes.TEXT,
      text: req.text,
      typeId: req.typeId,
    });
    await autoUpdateDate(req.groupId);
    await Group.findByIdAndUpdate(req.groupId, {
      last: m.id,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return m.save().then((item) =>
    item
      .populate({
        path: 'sender',
        select: 'fullname avatar',
      })
      .execPopulate()
  );
};

const sendLocation = async (user, req) => {
  console.log(req.location);
  // await checkMem(user.id, req.groupId);
  // const hashMess = generateMessage(user.id, req.groupId, req.text);
  // console.log('hash', hashMess);
  // const decode = await decodeMessage(hashMess);
  // console.log('decode', decode.sub);
  let m;
  try {
    m = new Message({
      groupId: req.groupId,
      sender: user.id,
      typeMessage: fileTypes.TEXT,
      location: req.location,
      typeId: -1,
    });
    await autoUpdateDate(req.groupId);
    await Group.findByIdAndUpdate(req.groupId, {
      last: m.id,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return m.save().then((item) =>
    item
      .populate({
        path: 'sender',
        select: 'fullname avatar',
      })
      .execPopulate()
  );
};

const getDowladFile = async (user, file, req) => {
  // await checkMem(user.id, req.groupId);
};

const recallMess = async (user, req) => {
  // await checkMem(user.id, req.groupId);
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
  // await checkMem(user.id, req.groupId);
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
  // await checkMem(user.id, req.groupId);
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

const getLastMess = async (user, options) => {
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
  sendLocation,
  sendMessHT,
};
