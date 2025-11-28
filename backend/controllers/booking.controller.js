const { getDB, client } = require('../config/database');
const { ObjectId } = require('mongodb');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Bookings');
    const bookings = await collection.find().toArray();
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create simple booking (legacy)
const createBooking = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Bookings');
    const { email, data, formData, time, status } = req.body;
    
    await collection.insertOne({
      email, 
      status,
      data, 
      formData,
      time,
      createdAt: new Date()
    });
    
    res.status(201).json({ success: true, message: 'Booking created successfully' });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update booking with form data
const updateBookingFormData = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Bookings');
    const { email, flightNumber, departureTime, time, formData } = req.body;
    
    const result = await collection.updateOne(
      { email, 'data.flightNumber': flightNumber, time, 'data.departureTime': departureTime },
      { $set: { formData } }
    );
    
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Cancel one passenger in booking
const cancelOnePassenger = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Bookings');
    const { email, flightNumber, departureTime, time, passengerIndex } = req.body;
    
    const result = await collection.updateOne(
      { email, 'data.flightNumber': flightNumber, time, 'data.departureTime': departureTime },
      { $set: { [`formData.${passengerIndex}.status`]: 0 } }
    );
    
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error cancelling passenger:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create booking with validation (improved with transaction)
const createBookingWithValidation = async (req, res) => {
  const session = client.startSession();
  
  try {
    const { email, data, formData, time, status } = req.body;
    const { flightNumber, departureTime, passengers, seat } = data;
    
    await session.withTransaction(async () => {
      const db = getDB();
      const flightCollection = db.collection('Flight Info');
      const bookingCollection = db.collection('Bookings');
      
      // Find and lock the flight document
      const flight = await flightCollection.findOne(
        { flightNumber, departureTime },
        { session }
      );
      
      if (!flight) {
        throw new Error('Flight not found');
      }
      
      // Check seat availability
      const seatType = seat.toLowerCase();
      const availableSeats = flight.seatsAvailable[seatType];
      
      console.log('Booking attempt:', {
        flightNumber,
        departureTime,
        seat,
        seatType,
        requestedPassengers: passengers,
        availableSeats,
        seatsAvailable: flight.seatsAvailable
      });
      
      if (!availableSeats || availableSeats < passengers) {
        throw new Error(`Only ${availableSeats || 0} ${seat} seats available, but ${passengers} requested`);
      }
      
      // Update seats atomically
      const updateResult = await flightCollection.updateOne(
        { 
          flightNumber, 
          departureTime
        },
        { 
          $inc: { [`seatsAvailable.${seatType}`]: -passengers } 
        },
        { 
          session
        }
      );
      
      if (updateResult.modifiedCount !== 1) {
        throw new Error('Failed to update seat availability. Please try again.');
      }
      
      // Create the booking
      const bookingResult = await bookingCollection.insertOne(
        {
          email,
          status,
          data,
          formData,
          time,
          bookingId: new Date().getTime().toString(),
          createdAt: new Date()
        },
        { session }
      );
      
      if (!bookingResult.insertedId) {
        throw new Error('Failed to create booking');
      }
    });
    
    // Get updated flight info after transaction
    const db = getDB();
    const flightCollection = db.collection('Flight Info');
    const updatedFlight = await flightCollection.findOne({ flightNumber, departureTime });
    
    res.json({ 
      success: true, 
      message: 'Booking confirmed successfully',
      remainingSeats: updatedFlight ? updatedFlight.seatsAvailable : null
    });
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    await session.endSession();
  }
};

// Cancel booking with seat restoration (improved)
const cancelBookingImproved = async (req, res) => {
  const session = client.startSession();
  
  try {
    await session.withTransaction(async () => {
      const db = getDB();
      const flightCollection = db.collection('Flight Info');
      const bookingCollection = db.collection('Bookings');
      
      const { bookingId, email, flightNumber, departureTime, passengers, seat } = req.body;
      
      // Find the booking
      const booking = await bookingCollection.findOne(
        { _id: new ObjectId(bookingId), email },
        { session }
      );
      
      if (!booking) {
        throw new Error('Booking not found');
      }
      
      if (booking.status === 0) {
        throw new Error('Booking is already cancelled');
      }
      
      // Update booking status
      await bookingCollection.updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: { status: 0, cancelledAt: new Date() } },
        { session }
      );
      
      // Restore seats
      const seatType = seat.toLowerCase();
      const flightUpdate = await flightCollection.updateOne(
        { flightNumber, departureTime },
        { $inc: { [`seatsAvailable.${seatType}`]: passengers } },
        { session }
      );
      
      if (flightUpdate.modifiedCount === 0) {
        throw new Error('Failed to restore seats');
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    });
    
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    await session.endSession();
  }
};

// Restore seats after cancellation (legacy)
const restoreSeats = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const { flightNumber, departureTime, passengers, seat } = req.body;
    
    const result = await collection.updateOne(
      { flightNumber, departureTime },
      { $inc: { [`seatsAvailable.${seat}`]: passengers } }
    );
    
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error restoring seats:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  updateBookingFormData,
  cancelOnePassenger,
  createBookingWithValidation,
  cancelBookingImproved,
  restoreSeats
};

