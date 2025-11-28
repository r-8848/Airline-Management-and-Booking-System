const { getDB } = require('../config/database');

// Get all flights
const getAllFlights = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flights');
    const flights = await collection.find().toArray();
    res.json(flights);
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create new flight
const createFlight = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flights');
    const data = req.body;

    const result = await collection.insertOne(data);
    res.status(201).json({ message: 'Flight added successfully', flightId: result.insertedId });
  } catch (error) {
    res.status(400).json({ error: 'Error adding flight: ' + error.message });
  }
};

// Get flight counts
const getFlightCounts = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flights');
    const counts = await collection.aggregate([
      { $group: { _id: '$flightName', count: { $sum: 1 } } },
      { $project: { flightName: '$_id', count: 1, _id: 0 } }
    ]).toArray();
    res.json(counts);
  } catch (err) {
    console.error('Error fetching flight counts:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get flight info with pagination
const getFlightInfo = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const page = parseInt(req.query.page) || null;
    const lim = 10;
    const skip = (page - 1) * lim;
    
    if (!page) {
      const fltinfo = await collection.find().toArray();
      res.json(fltinfo);
    } else {
      const total = await collection.countDocuments();
      const totalPages = Math.ceil(total / lim);
      const fltinfo = await collection.find().skip(skip).limit(lim).toArray();
      res.json({ fltinfo, totalPages });
    }
  } catch (err) {
    console.error('Error fetching flight info:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get specific flight info
const getSpecificFlightInfo = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const { flightNumber, departureDate } = req.body;
    
    const fltinfo = await collection.findOne({ flightNumber, departureDate });
    if (!fltinfo) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.json(fltinfo);
  } catch (err) {
    console.error('Error fetching flight info:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create flight info
const createFlightInfo = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const data = req.body;
    
    const fltinfo = await collection.insertOne(data);
    res.status(201).json({ message: 'Flight info created successfully', flightId: fltinfo.insertedId });
  } catch (err) {
    console.error('Error creating flight info:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update flight info
const updateFlightInfo = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const { flightNumber, departureTime, arrivalTime, seatsAvailable, prices, olddepTime } = req.body;
    
    const flight = await collection.updateOne(
      { flightNumber, departureTime: olddepTime },
      { $set: { departureTime, arrivalTime, newdepTime: departureTime, newarrTime: arrivalTime, seatsAvailable, prices } }
    );
    
    if (flight.modifiedCount > 0) {
      res.status(200).json({ message: 'Flight updated successfully' });
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reschedule flight
const rescheduleFlight = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const { flightNumber, departureTime, arrivalTime, newdepTime, newarrTime } = req.body;
    
    const flight = await collection.updateOne(
      { flightNumber, departureTime, arrivalTime },
      { $set: { newdepTime, newarrTime } }
    );
    
    if (flight.modifiedCount > 0) {
      res.status(200).json({ message: 'Flight rescheduled successfully' });
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    console.error('Error rescheduling flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update seat availability
const updateSeatAvailability = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const { flightNumber, departureTime, passengers, seat } = req.body;
    
    const result = await collection.updateOne(
      { flightNumber, departureTime },
      { $inc: { [`seatsAvailable.${seat}`]: -passengers } }
    );
    
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error updating seat availability:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Check seat availability
const checkAvailability = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Info');
    const { flightNumber, departureTime, passengers, seat } = req.body;

    const flight = await collection.findOne({ flightNumber, departureTime });
    
    if (!flight) {
      return res.status(404).json({ 
        success: false, 
        message: 'Flight not found' 
      });
    }
    
    const seatType = seat.toLowerCase();
    const availableSeats = flight.seatsAvailable[seatType];
    
    if (availableSeats < passengers) {
      return res.json({ 
        success: false, 
        available: false,
        message: `Only ${availableSeats} ${seat} seats available`,
        availableSeats
      });
    }
    
    res.json({ 
      success: true, 
      available: true,
      availableSeats,
      message: 'Seats are available' 
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error checking availability' 
    });
  }
};

// Get flight status
const getFlightStatus = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Flight Status');
    const status = await collection.find().toArray();
    res.json(status);
  } catch (err) {
    console.error('Error fetching flight status:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllFlights,
  createFlight,
  getFlightCounts,
  getFlightInfo,
  getSpecificFlightInfo,
  createFlightInfo,
  updateFlightInfo,
  rescheduleFlight,
  updateSeatAvailability,
  checkAvailability,
  getFlightStatus
};

