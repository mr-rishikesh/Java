const express = require('express');
const router = express.Router();
const CoreQuestion = require('../models/CoreQuestion');
const DailyActivity = require('../models/DailyActivity');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');

// Helper to record daily core activity in database
async function recordDailyCore(subject, question, efficiency, actionType = 'Studied') {
  const dateStr = new Date().toISOString().split('T')[0];
  if (getIsFallback()) {
    store.logActivity({
      date: dateStr,
      section: 'CORE',
      title: `${actionType} ${subject}: ${question}`,
      efficiency: Number(efficiency) || 100
    });
  } else {
    try {
      let act = await DailyActivity.findOne({ date: dateStr });
      if (!act) {
        act = new DailyActivity({ date: dateStr, solvedCount: 0, itemsSolved: [], averageEfficiency: 0 });
      }
      act.solvedCount += 1;
      act.itemsSolved.push({
        section: 'CORE',
        title: `${actionType} [${subject}]: ${question}`,
        efficiency: Number(efficiency) || 100
      });
      const totalEff = act.itemsSolved.reduce((sum, i) => sum + (i.efficiency || 100), 0);
      act.averageEfficiency = Math.round(totalEff / act.itemsSolved.length);
      act.studyHours = Number((act.solvedCount * 0.75).toFixed(1));
      await act.save();
    } catch (e) {
      console.error('Error logging daily core activity:', e);
    }
  }
}

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
    
    // Log daily activity
    await recordDailyCore(subject, question, efficiency || 100, 'Studied');
    
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
    if (updated) {
      // Log daily activity
      await recordDailyCore(updated.subject, updated.question, updated.efficiency || 100, 'Revised');
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
