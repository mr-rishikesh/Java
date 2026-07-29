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

// Helper to get a random problem for a specific Daily Pick slot
async function getRandomProblemForSlot(slotType, excludedIds = []) {
  const query = {
    status: { $ne: 'Solved' },
    neverShow: { $ne: true },
    _id: { $nin: excludedIds }
  };

  // Snooze filtering
  query.$or = [
    { snoozeUntil: null },
    { snoozeUntil: { $lte: new Date() } }
  ];

  // Slot matching
  if (slotType === 'dp') {
    query.category_name = 'Dynamic Programming [Patterns and Problems]';
  } else if (slotType === 'graph') {
    query.category_name = 'Graphs [Concepts & Problems]';
  } else {
    query.category_name = {
      $nin: [
        'Dynamic Programming [Patterns and Problems]',
        'Graphs [Concepts & Problems]'
      ]
    };
  }

  // Enforce 30-day non-repeat cooldown
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const finalQuery = {
    ...query,
    $or: [
      { lastPresentedAt: null },
      { lastPresentedAt: { $lte: oneMonthAgo } }
    ]
  };

  let pool = await Problem.find(finalQuery);

  // Fallback 1: Relax 30-day cooldown constraint
  if (pool.length === 0) {
    pool = await Problem.find(query);
  }

  // Fallback 2: Relax snooze limit to prevent empty list crashes
  if (pool.length === 0) {
    const fallbackQuery = {
      status: { $ne: 'Solved' },
      _id: { $nin: excludedIds }
    };
    if (slotType === 'dp') {
      fallbackQuery.category_name = 'Dynamic Programming [Patterns and Problems]';
    } else if (slotType === 'graph') {
      fallbackQuery.category_name = 'Graphs [Concepts & Problems]';
    } else {
      fallbackQuery.category_name = {
        $nin: [
          'Dynamic Programming [Patterns and Problems]',
          'Graphs [Concepts & Problems]'
        ]
      };
    }
    pool = await Problem.find(fallbackQuery);
  }

  // Fallback 3: Return any problem in the category (even if solved)
  if (pool.length === 0) {
    const lastResortQuery = {};
    if (slotType === 'dp') {
      lastResortQuery.category_name = 'Dynamic Programming [Patterns and Problems]';
    } else if (slotType === 'graph') {
      lastResortQuery.category_name = 'Graphs [Concepts & Problems]';
    } else {
      lastResortQuery.category_name = {
        $nin: [
          'Dynamic Programming [Patterns and Problems]',
          'Graphs [Concepts & Problems]'
        ]
      };
    }
    pool = await Problem.find(lastResortQuery);
  }

  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

// GET /api/dsa/daily-three - Get 3 random problems for today
router.get('/daily-three', async (req, res) => {
  try {
    if (getIsFallback()) {
      const dailyThree = store.getDailyThree();
      return res.json({ success: true, data: dailyThree });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let act = await DailyActivity.findOne({ date: todayStr });
    if (!act) {
      act = new DailyActivity({ date: todayStr, solvedCount: 0, itemsSolved: [], averageEfficiency: 0, activeDailyProblems: [] });
    }

    if (!act.activeDailyProblems || act.activeDailyProblems.length < 3) {
      const selected = [];

      // Slot 1: DP
      const dpProb = await getRandomProblemForSlot('dp', []);
      if (dpProb) {
        selected.push(dpProb);
        dpProb.lastPresentedAt = new Date();
        await dpProb.save();
      }

      // Slot 2: Graph
      const graphProb = await getRandomProblemForSlot('graph', selected.map(p => p._id));
      if (graphProb) {
        selected.push(graphProb);
        graphProb.lastPresentedAt = new Date();
        await graphProb.save();
      }

      // Slot 3: Other
      const otherProb = await getRandomProblemForSlot('other', selected.map(p => p._id));
      if (otherProb) {
        selected.push(otherProb);
        otherProb.lastPresentedAt = new Date();
        await otherProb.save();
      }

      act.activeDailyProblems = selected.map(p => p._id);
      await act.save();
    }

    // Populate activeDailyProblems
    const populated = await DailyActivity.findById(act._id).populate('activeDailyProblems');
    res.json({ success: true, data: (populated.activeDailyProblems || []).filter(Boolean) });
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

// PATCH /api/dsa/:id - Update problem status, efficiency, notes, snooze
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, efficiency, userNotes, snoozeOption, neverShow, snoozeUntil } = req.body;

    const updateData = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'Solved') {
        updateData.lastSolvedAt = new Date();
      }
      if (status === 'Revising') {
        updateData.neverShow = false;
      }
    }
    if (efficiency !== undefined) updateData.efficiency = Number(efficiency);
    if (userNotes !== undefined) updateData.userNotes = userNotes;

    if (snoozeOption !== undefined) {
      if (snoozeOption === '1_month') {
        updateData.snoozeUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (snoozeOption === '2_months') {
        updateData.snoozeUntil = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      } else if (snoozeOption === '3_months') {
        updateData.snoozeUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      } else if (snoozeOption === 'never') {
        updateData.neverShow = true;
      }
    }
    if (snoozeUntil !== undefined) {
      updateData.snoozeUntil = snoozeUntil ? new Date(snoozeUntil) : null;
    }
    if (neverShow !== undefined) updateData.neverShow = neverShow;

    if (getIsFallback()) {
      const updated = store.updateProblem(id, updateData);
      if (updated && status === 'Solved') {
        await recordDailySolve(updated.problem_name, efficiency || updated.efficiency || 100);
      }
      return res.json({ success: true, data: updated });
    }

    const updated = await Problem.findByIdAndUpdate(id, updateData, { new: true }) || 
                    await Problem.findOneAndUpdate({ problem_id: id }, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (status === 'Solved') {
      await recordDailySolve(updated.problem_name, efficiency || updated.efficiency || 100);
    }

    // Swapping Daily Picks if the problem is Solved, Snoozed, Blocked, or Rescheduled for Revision
    const shouldSwap = (status === 'Solved') || (status === 'Revising') || (snoozeOption !== undefined) || (snoozeUntil !== undefined) || (neverShow === true);
    if (shouldSwap) {
      const todayStr = new Date().toISOString().split('T')[0];
      let act = await DailyActivity.findOne({ date: todayStr });
      if (act && act.activeDailyProblems) {
        const activeIdx = act.activeDailyProblems.findIndex(pId => pId.toString() === updated._id.toString());
        if (activeIdx !== -1) {
          // Identify slot category
          let slotType = 'other';
          if (updated.category_name === 'Dynamic Programming [Patterns and Problems]') {
            slotType = 'dp';
          } else if (updated.category_name === 'Graphs [Concepts & Problems]') {
            slotType = 'graph';
          }

          // Get replacement problem from same category
          const replacement = await getRandomProblemForSlot(slotType, act.activeDailyProblems);
          if (replacement) {
            act.activeDailyProblems[activeIdx] = replacement._id;
            replacement.lastPresentedAt = new Date();
            await replacement.save();
          } else {
            // Remove if no replacement found
            act.activeDailyProblems.splice(activeIdx, 1);
          }
          await act.save();
        }
      }
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
