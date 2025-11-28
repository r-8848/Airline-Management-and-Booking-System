const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const connectDB = async () => {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    return client;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\nPlease check:');
    console.log('1. Your MongoDB URI in .env file');
    console.log('2. Database user credentials');
    console.log('3. IP whitelist in MongoDB Atlas');
    process.exit(1);
  }
};

const getDB = () => {
  return client.db('Airline');
};

module.exports = { connectDB, getDB, client };

