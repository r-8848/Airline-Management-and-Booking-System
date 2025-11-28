const { getDB } = require('../config/database');

// Get all feedback
const getAllFeedback = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Feedback');
    const feedback = await collection.find().toArray();
    res.json(feedback);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Feedback');
    const { email, firstImpression, hearAbout, missingAnything, rating } = req.body;
    
    const result = await collection.insertOne({
      email,
      firstImpression, 
      hearAbout, 
      missingAnything, 
      rating,
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedbackId: result.insertedId 
    });
  } catch (err) {
    console.error('Error creating feedback:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllFeedback,
  createFeedback
};

