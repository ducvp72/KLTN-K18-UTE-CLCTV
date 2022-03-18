const express = require('express');

const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.valiadation');
const adminController = require('../../controllers/admin.controller');
const authController = require('../../controllers/auth.controller');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(adminValidation.createAdmin), adminController.registerAdmin);
router.post('/login', validate(adminValidation.login), adminController.login);
router.post('/logout', validate(adminValidation.logout), authController.logout);
router.delete('/deleteAdmin', auth('manageUsers'), adminController.deleteAdmin);

module.exports = router;
