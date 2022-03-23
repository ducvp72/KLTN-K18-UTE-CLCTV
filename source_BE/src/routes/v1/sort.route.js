const express = require('express');
const validate = require('../../middlewares/validate');
const { userValidation, adminValidation } = require('../../validations');
const { sortController, adminController } = require('../../controllers');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.get('/getUserClient', auth(), validate(adminValidation.sortListUser), sortController.getUsersForClient);

router.get('/getUserAdmin', validate(userValidation.searchUser), adminController.getUsers);

module.exports = router;
