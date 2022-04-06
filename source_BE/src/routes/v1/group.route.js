const express = require('express');

const validate = require('../../middlewares/validate');
const { groupValidation } = require('../../validations');
const groupController = require('../../controllers/group.controller');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/getGroup', auth(), validate(groupValidation.getListGroup), groupController.getGroup);
router.post('/createChat', auth(), validate(groupValidation.member), groupController.createChat);
router.get('/getGroupById', auth(), validate(groupValidation.getGroupByID), groupController.getGroupById);
router.post('/createGroup', auth(), groupController.createGroup);
router.post('/changeNameGroup', auth(), validate(groupValidation.changeNameGroup), groupController.changeNameGroup);
router.post('/deleteGroup', auth(), validate(groupValidation.getGroupByID), groupController.deleteGroup);
router.post('/addMember', auth(), validate(groupValidation.addMember), groupController.addMember);
// router.post('/checkMember', auth(), validate(groupValidation.groupMember), groupController.checkMember);
// router.get('/searchMember', auth(), validate(), groupController.searchMember);
// router.get('/deleteMember', auth(), validate(), groupController.deleteMember);
// router.get('/setAdminGroup', auth(), validate(), groupController.setAdminGroup);
// router.get('/joinGroup', auth(), validate(), groupController.joinGroup);
// router.post('/leaveGroup', auth(), validate(), groupController.leaveGroup);
// router.get('/acceptRequest', auth(), validate(), groupController.acceptRequest);
// router.get('/cancleRequest', auth(), validate(), groupController.cancleRequest);
module.exports = router;
