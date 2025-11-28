const { getDB } = require('../config/database');

// Get all airports
const getAllAirports = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Airports');
    const airports = await collection.find().toArray();
    res.json(airports);
  } catch (err) {
    console.error('Error fetching airports:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllAirports
};

