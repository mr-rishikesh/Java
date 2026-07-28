const mongoose = require('mongoose');

let isInMemoryFallback = false;

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prep_dashboard';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[MongoDB Atlas Connected]: ${conn.connection.host} / DB: ${conn.connection.name}`);
    isInMemoryFallback = false;
  } catch (error) {
    console.warn(`[MongoDB Connection Warning]: Could not connect to MongoDB Atlas (${error.message}).`);
    console.warn(`[Fallback Active]: Operating using in-memory store as backup.`);
    isInMemoryFallback = true;
  }
};

const getIsFallback = () => isInMemoryFallback;

module.exports = { connectDB, getIsFallback };
