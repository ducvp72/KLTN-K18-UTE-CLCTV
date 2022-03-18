const express = require('express');

const validate = require('../../middlewares/validate');
const { friendValidation } = require('../../validations');
const friendController = require('../../controllers/friend.controller');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/add-friend', auth(), validate(friendValidation.friend), friendController.addFriend);
router.post('/unfriend', auth(), validate(friendValidation.friend), friendController.unFriend);
router.post('/accept-friend', auth(), validate(friendValidation.friend), friendController.acceptFriend);
router.post('/cancle-addfriend', auth(), validate(friendValidation.friend), friendController.cancleFriend);
router.post('/block-friend', auth(), validate(friendValidation.friend), friendController.blockFriend);
router.post('/unblock-friend', auth(), validate(friendValidation.friend), friendController.unblockFriend);
router.get('/check-isfriend', auth(), validate(friendValidation.friend), friendController.checkFriend);
router.get('/check-isBlockedFriend', auth(), validate(friendValidation.friend), friendController.checkisBlockedFriend);

module.exports = router;
