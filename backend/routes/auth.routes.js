const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

// Authentication routes
router.post('/login', authController.loginUser);
router.post('/adlogin', authController.loginAdmin);
router.post('/verify-token', authenticateToken, authController.verifyToken);

// Password management routes
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);
router.post('/reset-password', authController.resetPassword);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;

