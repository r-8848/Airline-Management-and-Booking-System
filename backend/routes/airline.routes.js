const express = require('express');
const router = express.Router();
const airlineController = require('../controllers/airline.controller');

// Airline routes
router.get('/', airlineController.getAllAirlines);
router.post('/', airlineController.createAirline);
router.patch('/add-flight', airlineController.addFlightToAirline);

module.exports = router;

