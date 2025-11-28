const bcrypt = require('bcryptjs');
const { getDB } = require('../config/database');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Users');
    const users = await collection.find().toArray();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Users');
    const { title, firstName, lastName, email, password, mobileNumber } = req.body;
    
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already Exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = { 
      title, 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      mobileNumber,
      createdAt: new Date(),
      status: 0
    };
    
    await collection.insertOne(newUser);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Users');
    const { email, updatedProfile } = req.body;
    
    const result = await collection.updateOne(
      { email: email },
      { $set: updatedProfile }
    );
    
    console.log('Update result:', result);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      console.log('User not found for update');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('Users');
    const { email, status } = req.body;
    
    console.log(req.body);
    const result = await collection.updateOne(
      { email: email },
      { $set: { status } }
    );
    
    console.log('Update status:', status);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      console.log('User not found for update');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  updateUserProfile,
  updateUserStatus
};

