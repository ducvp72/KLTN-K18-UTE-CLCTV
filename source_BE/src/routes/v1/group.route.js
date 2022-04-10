const express = require('express');

const validate = require('../../middlewares/validate');
const { groupValidation } = require('../../validations');
const groupController = require('../../controllers/group.controller');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/getGroup', auth(), validate(groupValidation.getListGroup), groupController.getGroup);
router.get('/getUserToAdd', auth(), validate(groupValidation.getUserToAdd), groupController.getUsersToAdd);
router.post('/createChat', auth(), validate(groupValidation.member), groupController.createChat);
router.get('/getGroupById', auth(), validate(groupValidation.getGroupByID), groupController.getGroupById);
router.post('/createGroup', auth(), validate(groupValidation.createGroup), groupController.createGroup);
router.post('/changeNameGroup', auth(), validate(groupValidation.changeNameGroup), groupController.changeNameGroup);
router.post('/deleteNameGroup', auth(), validate(groupValidation.deleteNameGroup), groupController.deleteNameGroup);
router.post('/deleteGroup', auth(), validate(groupValidation.getGroupByID), groupController.deleteGroup);
router.post('/addMember', auth(), validate(groupValidation.addMember), groupController.addMember);
router.post('/leaveGroup', auth(), validate(groupValidation.getGroupByID), groupController.leaveGroup);
router.delete('/deleteMember', auth(), validate(groupValidation.addMember), groupController.deleteMember);
router.get('/getWaitingGroupList', auth(), validate(groupValidation.getListWaiting), groupController.getListToAccept);
router.post('/checkMember', auth(), validate(groupValidation.groupMember), groupController.checkMember);
router.get('/searchMember', auth(), validate(), groupController.searchMember);
router.get('/setAdminGroup', auth(), validate(), groupController.setAdminGroup);
router.get('/joinGroup', auth(), validate(groupValidation.waitingMember), groupController.joinGroup);
router.get('/acceptRequest', auth(), validate(groupValidation.waitingMember), groupController.acceptRequest);
router.get('/cancleRequest', auth(), validate(groupValidation.waitingMember), groupController.cancleRequest);
router.post('/:groupId', auth(), validate(groupValidation.getGroupToJoin), groupController.getGroupLink);

module.exports = router;
