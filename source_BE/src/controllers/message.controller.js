const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { messageService, mediaService } = require('../services');
const { fileTypes, files } = require('../config/fileTypes');

const getMess = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'typeMessage']);
  const kq = await messageService.getMess(req.user, req.params.groupId, options);
  res.status(httpStatus.OK).send(kq);
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
  console.log(req.file);
  let type;
  const fileType = req.file.originalname.split('.').pop();
  console.log('type', fileType);
  switch (fileType) {
    case 'docx' || 'xlsx' || 'pdf' || 'pptx':
      type = fileTypes.READ;
      break;
    case 'rar' || 'zip':
      type = fileTypes.DOWNLOAD;
      break;
    case 'jpeg' || 'png' || 'gif' || 'jpg':
      type = fileTypes.IMAGE;
      break;
    case 'mp3' || 'wav' || 'wma':
      type = fileTypes.AUDIO;
      break;
    case 'mp4':
      type = fileTypes.VIDEO;
      break;
    default:
      break;
  }

  const kq = await mediaService.upLoadFile(req.user.id, req.file, type, req.body.groupId);
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
};
