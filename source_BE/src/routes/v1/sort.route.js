const express = require('express');
const validate = require('../../middlewares/validate');
const { adminValidation } = require('../../validations');
const { sortController } = require('../../controllers');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.get('/getUserClient', auth(), validate(adminValidation.sortListUser), sortController.getUsersForClient);

router.get('/getUserAdmin', auth('manageUsers'), validate(adminValidation.sortListUser), sortController.getUsersForAdmin);

module.exports = router;
