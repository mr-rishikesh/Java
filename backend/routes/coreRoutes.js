const express = require('express');
const router = express.Router();
const CoreQuestion = require('../models/CoreQuestion');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');

// GET /api/core - Get core questions
router.get('/', async (req, res) => {
  try {
    const { subject } = req.query;
    if (getIsFallback()) {
      let list = store.getCore();
      if (subject) list = list.filter(c => c.subject === subject);
      return res.json({ success: true, count: list.length, data: list });
    }

    const query = subject ? { subject } : {};
    const questions = await CoreQuestion.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/core - Add core question
router.post('/', async (req, res) => {
  try {
    const { subject, question, answer, keyTakeaways, importance, status, efficiency } = req.body;
    if (!question || !subject) {
      return res.status(400).json({ success: false, message: 'Subject and question are required' });
    }

    if (getIsFallback()) {
      const created = store.addCore({ subject, question, answer, keyTakeaways, importance, status, efficiency });
      return res.json({ success: true, data: created });
    }

    const newQ = new CoreQuestion({ subject, question, answer, keyTakeaways, importance, status, efficiency });
    await newQ.save();
    res.json({ success: true, data: newQ });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/core/:id - Update core question
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsFallback()) {
      const updated = store.updateCore(id, req.body);
      return res.json({ success: true, data: updated });
    }

    const updated = await CoreQuestion.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
