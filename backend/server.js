const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB, getIsFallback } = require('./config/db');
const { runSeeder } = require('./utils/seeder');
const store = require('./utils/inMemoryStore');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let isStoreInitialized = false;

// Database connection & seeding middleware for serverless environment
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    if (getIsFallback()) {
      if (!isStoreInitialized) {
        await store.init();
        isStoreInitialized = true;
        console.log('[Serverless]: In-Memory Data Store Ready.');
      }
    } else {
      if (!isStoreInitialized) {
        await runSeeder();
        isStoreInitialized = true;
        console.log('[Serverless]: MongoDB Seeder Completed.');
      }
    }
  } catch (err) {
    console.error('[Middleware Error]:', err);
  }
  next();
});

// Import route modules
const dsaRoutes = require('./routes/dsaRoutes');
const coreRoutes = require('./routes/coreRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applyRoutes = require('./routes/applyRoutes');
const commRoutes = require('./routes/commRoutes');
const progressRoutes = require('./routes/progressRoutes');

// Mount Routes (supporting both with and without /api/ prefixes to handle Vercel proxying variations)
app.use('/api/dsa', dsaRoutes);
app.use('/dsa', dsaRoutes);

app.use('/api/core', coreRoutes);
app.use('/core', coreRoutes);

app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/apply', applyRoutes);
app.use('/apply', applyRoutes);

app.use('/api/communication', commRoutes);
app.use('/communication', commRoutes);

app.use('/api/progress', progressRoutes);
app.use('/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    dbFallbackActive: getIsFallback(),
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  await connectDB();
  
  if (getIsFallback()) {
    await store.init();
    isStoreInitialized = true;
    console.log('[Server]: In-Memory Data Store Ready.');
  } else {
    await runSeeder();
    isStoreInitialized = true;
    console.log('[Server]: MongoDB Seeder Completed.');
  }

  app.listen(PORT, () => {
    console.log(`[PrepPulse Backend Server]: Running on http://localhost:${PORT}`);
  });
};

if (process.env.VERCEL) {
  // Export app instance for Vercel Serverless Function
  module.exports = app;
} else {
  // Run standard local server listening on PORT
  startServer();
}
