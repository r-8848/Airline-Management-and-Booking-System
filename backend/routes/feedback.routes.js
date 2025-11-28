const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// Feedback routes
router.get('/', feedbackController.getAllFeedback);
router.post('/', feedbackController.createFeedback);

module.exports = router;

