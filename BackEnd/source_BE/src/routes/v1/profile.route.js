const express = require('express');
const validate = require('../../middlewares/validate');
const { profileValidation } = require('../../validations');
const profileController = require('../../controllers/profile.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();
const middlewares = require('../../middlewares/file');

router.get('/:id', validate(profileValidation.findProfileById), profileController.findProfileById);
router.post('/change-avatar', auth(), middlewares.uploadFile, profileController.changeAvatar);
router.put('/change-profile', auth(), validate(profileValidation.changeProfile), profileController.changeProfile);
router.put('/change-password', auth(), validate(profileValidation.resetPassword), profileController.resetPassword);

module.exports = router;
