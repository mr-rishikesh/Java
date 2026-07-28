const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');

// GET /api/communication - Get all communication items
router.get('/', async (req, res) => {
  try {
    if (getIsFallback()) {
      return res.json({ success: true, data: store.getComm() });
    }
    const items = await Communication.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/communication - Add new HR / STAR response question
router.post('/', async (req, res) => {
  try {
    const { title, category, situation, task, action, result, fullAnswer, confidenceLevel, efficiency } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Question title is required' });
    }

    if (getIsFallback()) {
      const created = store.addComm({ title, category, situation, task, action, result, fullAnswer, confidenceLevel, efficiency });
      return res.json({ success: true, data: created });
    }

    const newComm = new Communication({ title, category, situation, task, action, result, fullAnswer, confidenceLevel, efficiency });
    await newComm.save();
    res.json({ success: true, data: newComm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/communication/:id - Update STAR response or efficiency
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsFallback()) {
      const updated = store.updateComm(id, req.body);
      return res.json({ success: true, data: updated });
    }

    const updated = await Communication.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
