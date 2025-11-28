const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Payment routes
router.post('/', paymentController.createPaymentSession);

module.exports = router;

