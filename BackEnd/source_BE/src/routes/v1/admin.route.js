const express = require('express');

const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.validation');
const adminController = require('../../controllers/admin.controller');
const authController = require('../../controllers/auth.controller');
const sortController = require('../../controllers/sort.controller');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(adminValidation.createAdmin), adminController.registerAdmin);
router.post('/login', validate(adminValidation.login), adminController.login);
router.put('/reset-password', validate(adminValidation.forgot), adminController.resetAdminPassword);
router.post('/logout', validate(adminValidation.logout), authController.logout);
// router.post('/refresh-tokens', auth('manageUsers'), adminController.login);
router.delete('/deleteAdmin', auth('manageUsers'), adminController.deleteAdmin);
router.put(
  '/change-profile',
  auth('manageUsers'),
  validate(adminValidation.updateAdmin),
  adminController.changeAdminProfile
);
router.put(
  '/change-password',
  auth('manageUsers'),
  validate(adminValidation.resetPassword),
  adminController.changeAdminPassword
);
router.put('/reset-default-password', validate(adminValidation.defaultPassword), adminController.resetAdminPassword);
router.put(
  '/reset-password-user',
  auth('manageUsers'),
  validate(adminValidation.defaultPasswordUser),
  adminController.resetUserPassword
);
router.get(
  '/get-user-forAdmin',
  auth('manageUsers'),
  validate(adminValidation.getUserForAdmin),
  adminController.getUserForAdmin
);

router.post('/ban-user-forAdmin', auth('manageUsers'), validate(adminValidation.getUserId), adminController.banUser);

router.post('/delete-user-forAdmin', auth('manageUsers'), validate(adminValidation.getUserId), adminController.deleteUser);

router.get('/getUsers', auth('manageUsers'), validate(adminValidation.sortListUser), sortController.getUsersForAdmin);

module.exports = router;
