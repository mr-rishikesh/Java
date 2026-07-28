const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsFallback } = require('./config/db');
const { runSeeder } = require('./utils/seeder');
const store = require('./utils/inMemoryStore');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/dsa', require('./routes/dsaRoutes'));
app.use('/api/core', require('./routes/coreRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/apply', require('./routes/applyRoutes'));
app.use('/api/communication', require('./routes/commRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

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
    console.log('[Server]: In-Memory Data Store Ready.');
  } else {
    await runSeeder();
    console.log('[Server]: MongoDB Seeder Completed.');
  }

  app.listen(PORT, () => {
    console.log(`[PrepPulse Backend Server]: Running on http://localhost:${PORT}`);
  });
};

startServer();
