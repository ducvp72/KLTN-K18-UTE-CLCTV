const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { messageService, mediaService } = require('../services');
const { fileTypes } = require('../config/fileTypes');

const getMess = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'typeMessage']);
  const kq = await messageService.getMess(req.user, req.params.groupId, options);
  res.status(httpStatus.OK).send(kq);
});

const getLastMessGroup = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['key']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const rs = await messageService.getListMess(req.user, filter, options);
  res.status(httpStatus.OK).send(rs);
});

const getFile = catchAsync(async (req, res) => {
  const kq = await messageService.getFile(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const sendMess = catchAsync(async (req, res) => {
  const kq = await messageService.sendMess(req.user, req.body);
  res.status(httpStatus.CREATED).send(kq);
});

const sendFile = catchAsync(async (req, res) => {
  let typeMessage;
  const type = req.file.originalname.split('.').pop().toLowerCase();
  const getMine = req.file.mimetype.split('/')[0];
  // console.log('type', type);
  // console.log('getMine', getMine);

  if (getMine === 'image' || getMine === 'video' || getMine === 'audio') {
    if (type === 'jpeg' || type === 'png' || type === 'gif' || type === 'jpg') {
      typeMessage = fileTypes.IMAGE;
    }
    if (type === 'mp3' || type === 'wav' || type === 'wma' || type === 'm4a') {
      typeMessage = fileTypes.AUDIO;
    }
    if (type === 'mp4') typeMessage = fileTypes.VIDEO;
  } else {
    if (type === 'docx' || type === 'xlsx' || type === 'pdf' || type === 'pptx') {
      typeMessage = fileTypes.READ;
    }
    if (type === 'rar' || type === 'zip' || type === 'rar4' || type === 'txt') {
      typeMessage = fileTypes.DOWNLOAD;
    }
  }

  const kq = await mediaService.upLoadFile(req.user.id, req.file, typeMessage, req.body.groupId);
  await messageService.autoUpdateDate(req.body.groupId);

  res.status(httpStatus.CREATED).send(kq);
});

const getLastMess = catchAsync(async (req, res) => {
  const kq = await messageService.getLastMess(req.user, req.params.groupId);
  res.status(httpStatus.OK).send(kq);
});

const recallMess = catchAsync(async (req, res) => {
  const kq = await messageService.recallMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const deleteRecall = catchAsync(async (req, res) => {
  const kq = await messageService.deleteRecall(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const sendLike = catchAsync(async (req, res) => {
  const kq = await messageService.sendLike(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const sendLove = catchAsync(async (req, res) => {
  const kq = await messageService.sendLove(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const attachMess = catchAsync(async (req, res) => {
  const kq = await messageService.attachMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const editAttach = catchAsync(async (req, res) => {
  const kq = await messageService.deleteMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const deleteAttach = catchAsync(async (req, res) => {
  const kq = await messageService.deleteAttach(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

module.exports = {
  getFile,
  editAttach,
  getMess,
  sendFile,
  sendLike,
  sendLove,
  attachMess,
  deleteAttach,
  sendMess,
  recallMess,
  deleteRecall,
  getLastMess,
  getLastMessGroup,
};
