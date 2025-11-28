const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyparser = require('body-parser');

const { connectDB } = require('./config/database');
const { initializeEmailTransporter } = require('./utils/email');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require('./routes/booking.routes');
const airlineRoutes = require('./routes/airline.routes');
const airportRoutes = require('./routes/airport.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyparser.json());

// Initialize database and email
connectDB().then(() => {
  initializeEmailTransporter();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/airlines', airlineRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payments', paymentRoutes);

// Legacy routes for backward compatibility
// These maintain the old endpoint structure while using new controllers
const legacyRoutes = express.Router();

// Auth legacy routes
legacyRoutes.get('/login', (req, res) => res.redirect(301, '/api/auth/login'));
legacyRoutes.post('/login', require('./controllers/auth.controller').loginUser);
legacyRoutes.get('/adlogin', (req, res) => res.redirect(301, '/api/auth/adlogin'));
legacyRoutes.post('/adlogin', require('./controllers/auth.controller').loginAdmin);
legacyRoutes.post('/verify-token', require('./middleware/auth').authenticateToken, require('./controllers/auth.controller').verifyToken);
legacyRoutes.post('/forgot-password', require('./controllers/auth.controller').forgotPassword);
legacyRoutes.get('/verify-reset-token/:token', require('./controllers/auth.controller').verifyResetToken);
legacyRoutes.post('/reset-password', require('./controllers/auth.controller').resetPassword);
legacyRoutes.post('/change-password', require('./middleware/auth').authenticateToken, require('./controllers/auth.controller').changePassword);

// User legacy routes
legacyRoutes.post('/users', require('./controllers/user.controller').registerUser);
legacyRoutes.get('/update-profile', require('./controllers/user.controller').getAllUsers);
legacyRoutes.post('/update-profile', require('./controllers/user.controller').updateUserProfile);
legacyRoutes.get('/update-profile-on', require('./controllers/user.controller').getAllUsers);
legacyRoutes.post('/update-profile-on', require('./controllers/user.controller').updateUserStatus);

// Airline legacy routes
legacyRoutes.get('/airlines-addflt', require('./controllers/airline.controller').getAllAirlines);
legacyRoutes.post('/airlines-addflt', require('./controllers/airline.controller').addFlightToAirline);

// Booking legacy routes
legacyRoutes.get('/booking', require('./controllers/booking.controller').getAllBookings);
legacyRoutes.post('/booking', require('./controllers/booking.controller').updateBookingFormData);
legacyRoutes.get('/cancelOne', require('./controllers/booking.controller').getAllBookings);
legacyRoutes.post('/cancelOne', require('./controllers/booking.controller').cancelOnePassenger);

// Flight info legacy routes
legacyRoutes.get('/flightinfo', require('./controllers/flight.controller').getFlightInfo);
legacyRoutes.post('/flightinfo', require('./controllers/flight.controller').getSpecificFlightInfo);
legacyRoutes.get('/flightin', require('./controllers/flight.controller').getFlightInfo);
legacyRoutes.post('/flightin', require('./controllers/flight.controller').createFlightInfo);
legacyRoutes.get('/edit-flightin', require('./controllers/flight.controller').getFlightInfo);
legacyRoutes.post('/edit-flightin', require('./controllers/flight.controller').updateFlightInfo);
legacyRoutes.get('/re-edit-flightin', require('./controllers/flight.controller').getFlightInfo);
legacyRoutes.post('/re-edit-flightin', require('./controllers/flight.controller').rescheduleFlight);

// Flight seat management legacy routes
legacyRoutes.get('/flight', require('./controllers/flight.controller').getFlightInfo);
legacyRoutes.post('/flight', require('./controllers/flight.controller').updateSeatAvailability);
legacyRoutes.get('/cancelall', require('./controllers/flight.controller').getFlightInfo);
legacyRoutes.post('/cancelall', require('./controllers/booking.controller').restoreSeats);

// Advanced booking routes
legacyRoutes.post('/booking-with-validation', require('./controllers/booking.controller').createBookingWithValidation);
legacyRoutes.post('/cancel-booking-improved', require('./controllers/booking.controller').cancelBookingImproved);
legacyRoutes.post('/check-availability', require('./controllers/flight.controller').checkAvailability);

app.use('/api', legacyRoutes);

// Flight status route (original was WITHOUT /api prefix)
app.get('/fltstatus', require('./controllers/flight.controller').getFlightStatus);

// Health check endpoint
app.get('/api/test', (req, res) => {
  const { client } = require('./config/database');
  const { getEmailTransporter } = require('./utils/email');
  const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
  
  res.json({
    status: 'Server is running',
    mongoConnected: client.topology && client.topology.isConnected(),
    stripeConfigured: !!stripe,
    emailConfigured: !!getEmailTransporter(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested endpoint does not exist',
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${port}/api`);
});

module.exports = app;
