// config/db.js
// MongoDB connection configuration using Mongoose

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses MONGO_URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit if DB connection fails
  }
};

module.exports = connectDB;
