const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

const sendLike = catchAsync(async (req, res) => {
  const kq = await messageService.sendLike(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const sendLove = catchAsync(async (req, res) => {
  const kq = await messageService.sendLove(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const recallMess = catchAsync(async (req, res) => {
  const kq = await messageService.recallMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const attachMess = catchAsync(async (req, res) => {
  const kq = await messageService.attachMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const editMess = catchAsync(async (req, res) => {
  const kq = await messageService.editMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const deleteAttach = catchAsync(async (req, res) => {
  const kq = await messageService.deleteAttach(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const sendMess = catchAsync(async (req, res) => {
  const kq = await messageService.sendMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const deleteMess = catchAsync(async (req, res) => {
  const kq = await messageService.deleteMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

const editAttach = catchAsync(async (req, res) => {
  const kq = await messageService.deleteMess(req.file, req.user);
  res.status(httpStatus.OK).send(kq);
});

module.exports = { editAttach, sendLike, sendLove, attachMess, editMess, deleteAttach, sendMess, recallMess, deleteMess };
