const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// Booking routes
router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.put('/form-data', bookingController.updateBookingFormData);
router.patch('/cancel-passenger', bookingController.cancelOnePassenger);

// Improved booking routes with validation
router.post('/with-validation', bookingController.createBookingWithValidation);
router.post('/cancel-improved', bookingController.cancelBookingImproved);

// Seat restoration (legacy)
router.patch('/restore-seats', bookingController.restoreSeats);

module.exports = router;

