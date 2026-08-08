const mongoose = require('mongoose');

let isInMemoryFallback = false;
let connectionAttemptPromise = null;

const connectDB = async () => {
  // If we already have an active connection, do nothing
  if (mongoose.connection.readyState === 1) {
    isInMemoryFallback = false;
    return;
  }
  
  // If we've already tried and failed, and are in fallback mode, don't keep retrying blockingly
  if (isInMemoryFallback) {
    return;
  }

  // If there's an ongoing connection attempt, wait for it
  if (connectionAttemptPromise) {
    return connectionAttemptPromise;
  }

  connectionAttemptPromise = (async () => {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prep_dashboard';
    try {
      const timeout = process.env.VERCEL ? 3000 : 10000;
      const conn = await mongoose.connect(connUri, {
        serverSelectionTimeoutMS: timeout
      });
      console.log(`[MongoDB Atlas Connected]: ${conn.connection.host} / DB: ${conn.connection.name}`);
      isInMemoryFallback = false;
    } catch (error) {
      console.warn(`[MongoDB Connection Warning]: Could not connect to MongoDB Atlas (${error.message}).`);
      console.warn(`[Fallback Active]: Operating using in-memory store as backup.`);
      isInMemoryFallback = true;
    } finally {
      connectionAttemptPromise = null;
    }
  })();

  return connectionAttemptPromise;
};

const getIsFallback = () => isInMemoryFallback;

module.exports = { connectDB, getIsFallback };
