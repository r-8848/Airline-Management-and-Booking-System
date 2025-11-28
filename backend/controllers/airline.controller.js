const { getDB } = require('../config/database');

// Get all airlines
const getAllAirlines = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Airlines');
    const airlines = await collection.find().toArray();
    res.json(airlines);
  } catch (err) {
    console.error('Error fetching airlines:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create new airline
const createAirline = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Airlines');
    const data = req.body;
    
    const result = await collection.insertOne(data);
    res.status(201).json({ 
      success: true, 
      message: 'Airline created successfully', 
      airlineId: result.insertedId 
    });
  } catch (err) {
    console.error('Error creating airline:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Add flight to airline
const addFlightToAirline = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Airlines');
    const data = req.body;
    
    const result = await collection.updateOne(
      { flightCode: data.flightCode },
      { $push: { flights: data.flightNumber } }
    );
    
    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true, message: 'Flight number added successfully' });
    } else {
      res.status(404).json({ success: false, message: 'No matching flight code found' });
    }
  } catch (err) {
    console.error('Error adding flight to airline:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllAirlines,
  createAirline,
  addFlightToAirline
};

