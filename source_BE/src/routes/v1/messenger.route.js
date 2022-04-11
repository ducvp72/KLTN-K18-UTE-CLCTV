const express = require('express');

const validate = require('../../middlewares/validate');
const { groupValidation, messageValidation } = require('../../validations');
const messageController = require('../../controllers/message.controller');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.get('/', auth(), validate(groupValidation.getListGroup), messageController.getMess);
router.post('/sendMess', auth(), validate(groupValidation.getListGroup), messageController.sendMess);
router.delete('/deleteRecall', auth(), validate(groupValidation.getListGroup), messageController.deleteRecall);
router.post('/recallMess', auth(), validate(groupValidation.getListGroup), messageController.recallMess);
router.post('/sendLike', auth(), validate(groupValidation.getListGroup), messageController.sendLike);
router.post('/sendLove', auth(), validate(groupValidation.getListGroup), messageController.sendLove);

// router.post('/attachMess', auth(), validate(groupValidation.getListGroup), messageController.attachMess);
// router.post('/deleteAttach', auth(), validate(groupValidation.getListGroup), messageController.deleteAttach);
// router.post('/editAttach', auth(), validate(groupValidation.getListGroup), messageController.editAttach);

module.exports = router;
