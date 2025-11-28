const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport.controller');

// Airport routes
router.get('/', airportController.getAllAirports);

module.exports = router;

