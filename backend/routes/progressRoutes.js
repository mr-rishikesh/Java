const express = require('express');
const router = express.Router();
const DailyActivity = require('../models/DailyActivity');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');

// GET /api/progress/heatmap - Fetch activity grid & daily efficiency scores for past 365 days
router.get('/heatmap', async (req, res) => {
  try {
    let activities = [];

    if (getIsFallback()) {
      activities = store.getActivities();
    } else {
      activities = await DailyActivity.find({}).sort({ date: 1 });
    }

    // Convert into date map for fast frontend lookup
    const dateMap = {};
    activities.forEach(a => {
      dateMap[a.date] = {
        count: a.solvedCount,
        efficiency: a.averageEfficiency || 0,
        studyHours: a.studyHours || 0,
        items: a.itemsSolved || []
      };
    });

    res.json({
      success: true,
      data: dateMap,
      raw: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/progress/log - Log daily activity with efficiency score
router.post('/log', async (req, res) => {
  try {
    const { date, section, itemId, title, efficiency } = req.body;
    const dateStr = date || new Date().toISOString().split('T')[0];

    if (getIsFallback()) {
      const updated = store.logActivity({ date: dateStr, section, itemId, title, efficiency });
      return res.json({ success: true, data: updated });
    }

    let act = await DailyActivity.findOne({ date: dateStr });
    if (!act) {
      act = new DailyActivity({ date: dateStr, solvedCount: 0, itemsSolved: [], averageEfficiency: 0 });
    }

    act.solvedCount += 1;
    act.itemsSolved.push({
      section: section || 'DSA',
      itemId: itemId || '',
      title: title || 'Activity Log',
      efficiency: Number(efficiency) || 100
    });

    const totalEff = act.itemsSolved.reduce((sum, item) => sum + (item.efficiency || 100), 0);
    act.averageEfficiency = Math.round(totalEff / act.itemsSolved.length);
    act.studyHours = Number((act.solvedCount * 0.75).toFixed(1));

    await act.save();
    res.json({ success: true, data: act });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
