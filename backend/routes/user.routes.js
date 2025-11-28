const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// User routes
router.get('/', userController.getAllUsers);
router.post('/', userController.registerUser);
router.put('/profile', userController.updateUserProfile);
router.patch('/status', userController.updateUserStatus);

module.exports = router;

