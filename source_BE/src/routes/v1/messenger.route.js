const express = require('express');

const validate = require('../../middlewares/validate');
const { messageValidation } = require('../../validations');
const messageController = require('../../controllers/message.controller');
const fileMiddleware = require('../../middlewares/file');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.get('/:groupId', auth(), validate(messageValidation.getFileById), messageController.getMess);
router.post('/sendMess', auth(), validate(messageValidation.sendText), messageController.sendMess);
router.post('/sendFile', auth(), fileMiddleware.uploadFile, validate(messageValidation.groupId), messageController.sendFile);

router.get('/getLastMess/:groupId', auth(), validate(messageValidation.getFileById), messageController.getLastMess);
router.get('/getFile/:id', auth(), validate(messageValidation.getFile), messageController.getFile);
router.post('/sendLike', auth(), validate(messageValidation.getFileById), messageController.sendLike);
router.post('/sendLove', auth(), validate(messageValidation.getFileById), messageController.sendLove);

// router.delete('/deleteRecall', auth(), validate(messageValidation.getFileById), messageController.deleteRecall);
// router.post('/recallMess', auth(), validate(messageValidation.getFileById), messageController.recallMess);
// router.post('/attachMess', auth(), validate(groupValidation.getListGroup), messageController.attachMess);
// router.post('/deleteAttach', auth(), validate(groupValidation.getListGroup), messageController.deleteAttach);
// router.post('/editAttach', auth(), validate(groupValidation.getListGroup), messageController.editAttach);

module.exports = router;
