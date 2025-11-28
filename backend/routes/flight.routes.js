const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');

// Flight routes
router.get('/', flightController.getAllFlights);
router.post('/', flightController.createFlight);
router.get('/count', flightController.getFlightCounts);

// Flight info routes
router.get('/info', flightController.getFlightInfo);
router.post('/info', flightController.getSpecificFlightInfo);
router.post('/info/create', flightController.createFlightInfo);
router.put('/info', flightController.updateFlightInfo);
router.patch('/info/reschedule', flightController.rescheduleFlight);

// Seat management
router.patch('/seats', flightController.updateSeatAvailability);
router.post('/check-availability', flightController.checkAvailability);

// Flight status
router.get('/status', flightController.getFlightStatus);

module.exports = router;

