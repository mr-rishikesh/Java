const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');
const DailyActivity = require('../models/DailyActivity');

// Helper to update daily activity on solve
async function recordDailySolve(problemTitle, efficiency) {
  const dateStr = new Date().toISOString().split('T')[0];
  if (getIsFallback()) {
    store.logActivity({ date: dateStr, section: 'DSA', title: problemTitle, efficiency });
  } else {
    try {
      let act = await DailyActivity.findOne({ date: dateStr });
      if (!act) {
        act = new DailyActivity({ date: dateStr, solvedCount: 0, itemsSolved: [], averageEfficiency: 0 });
      }
      act.solvedCount += 1;
      act.itemsSolved.push({ section: 'DSA', title: problemTitle, efficiency });
      const totalEff = act.itemsSolved.reduce((sum, i) => sum + (i.efficiency || 100), 0);
      act.averageEfficiency = Math.round(totalEff / act.itemsSolved.length);
      act.studyHours = Number((act.solvedCount * 0.75).toFixed(1));
      await act.save();
    } catch (e) {
      console.error('Error logging daily solve:', e);
    }
  }
}

// GET /api/dsa - Get list of problems with filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, subcategory, difficulty, status, page = 1, limit = 500 } = req.query;

    if (getIsFallback()) {
      const list = store.getProblems({ search, category, subcategory, difficulty, status });
      return res.json({
        success: true,
        count: list.length,
        data: list.slice(0, Number(limit))
      });
    }

    const query = {};
    if (search) {
      query.$or = [
        { problem_name: { $regex: search, $options: 'i' } },
        { subcategory_name: { $regex: search, $options: 'i' } },
        { category_name: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category_name = category;
    if (subcategory) query.subcategory_name = subcategory;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;

    const problems = await Problem.find(query).limit(Number(limit));
    res.json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dsa/categories - Get category breakdown
router.get('/categories', async (req, res) => {
  try {
    if (getIsFallback()) {
      const problems = store.getProblems();
      const catMap = {};
      problems.forEach(p => {
        const cat = p.category_name || 'General';
        const sub = p.subcategory_name || 'General';
        if (!catMap[cat]) catMap[cat] = { name: cat, subcategories: {} };
        if (!catMap[cat].subcategories[sub]) catMap[cat].subcategories[sub] = 0;
        catMap[cat].subcategories[sub]++;
      });
      return res.json({ success: true, data: catMap });
    }

    const problems = await Problem.find({}, 'category_name subcategory_name difficulty status');
    const catMap = {};
    problems.forEach(p => {
      const cat = p.category_name || 'General';
      const sub = p.subcategory_name || 'General';
      if (!catMap[cat]) catMap[cat] = { name: cat, subcategories: {} };
      if (!catMap[cat].subcategories[sub]) catMap[cat].subcategories[sub] = 0;
      catMap[cat].subcategories[sub]++;
    });
    res.json({ success: true, data: catMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/dsa/daily-three - Get 3 random problems for today
router.get('/daily-three', async (req, res) => {
  try {
    if (getIsFallback()) {
      const dailyThree = store.getDailyThree();
      return res.json({ success: true, data: dailyThree });
    }

    // Pick 3 problems deterministically based on date hash
    const todayStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    let pool = await Problem.find({ status: { $ne: 'Solved' } });
    if (pool.length < 3) {
      pool = await Problem.find({});
    }

    const idx1 = absHash % pool.length;
    const idx2 = (absHash + 37) % pool.length;
    const idx3 = (absHash + 101) % pool.length;

    const chosenIndices = new Set([idx1]);
    let second = idx2;
    while (chosenIndices.has(second) && pool.length > 1) second = (second + 1) % pool.length;
    chosenIndices.add(second);
    let third = idx3;
    while (chosenIndices.has(third) && pool.length > 2) third = (third + 1) % pool.length;

    const dailyThree = [pool[idx1], pool[second], pool[third]];
    res.json({ success: true, data: dailyThree });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/dsa - Add custom problem
router.post('/', async (req, res) => {
  try {
    const { problem_name, category_name, subcategory_name, difficulty, leetcode, article, youtube, userNotes } = req.body;
    
    if (!problem_name) {
      return res.status(400).json({ success: false, message: 'Problem name is required' });
    }

    if (getIsFallback()) {
      const newProb = store.addProblem({
        problem_name,
        category_name: category_name || 'Custom',
        subcategory_name: subcategory_name || 'Personal Practice',
        difficulty: difficulty || 'Medium',
        leetcode: leetcode || null,
        article: article || null,
        youtube: youtube || null,
        userNotes: userNotes || ''
      });
      return res.json({ success: true, data: newProb });
    }

    const newProb = new Problem({
      problem_id: `custom_${Date.now()}`,
      problem_name,
      category_name: category_name || 'Custom',
      subcategory_name: subcategory_name || 'Personal Practice',
      difficulty: difficulty || 'Medium',
      leetcode: leetcode || null,
      article: article || null,
      youtube: youtube || null,
      userNotes: userNotes || '',
      isCustom: true
    });
    await newProb.save();
    res.json({ success: true, data: newProb });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/dsa/:id - Update problem status, efficiency, notes
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, efficiency, userNotes } = req.body;

    const updateData = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'Solved') {
        updateData.lastSolvedAt = new Date();
      }
    }
    if (efficiency !== undefined) updateData.efficiency = Number(efficiency);
    if (userNotes !== undefined) updateData.userNotes = userNotes;

    if (getIsFallback()) {
      const updated = store.updateProblem(id, updateData);
      if (updated && status === 'Solved') {
        await recordDailySolve(updated.problem_name, efficiency || updated.efficiency || 100);
      }
      return res.json({ success: true, data: updated });
    }

    const updated = await Problem.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      // Try by problem_id
      const byProbId = await Problem.findOneAndUpdate({ problem_id: id }, updateData, { new: true });
      if (byProbId && status === 'Solved') {
        await recordDailySolve(byProbId.problem_name, efficiency || byProbId.efficiency || 100);
      }
      return res.json({ success: true, data: byProbId });
    }

    if (status === 'Solved') {
      await recordDailySolve(updated.problem_name, efficiency || updated.efficiency || 100);
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
