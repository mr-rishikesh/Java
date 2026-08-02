const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const DailyActivity = require('../models/DailyActivity');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    if (getIsFallback()) {
      return res.json({ success: true, data: store.getProjects() });
    }
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, status, efficiency } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (getIsFallback()) {
      const created = store.addProject({ title, description, techStack, githubUrl, liveUrl, status, efficiency });
      return res.json({ success: true, data: created });
    }

    const newProj = new Project({ title, description, techStack, githubUrl, liveUrl, status, efficiency });
    await newProj.save();
    res.json({ success: true, data: newProj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/projects/:id/questions - Add an interview Q to a project
router.post('/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, type } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question text is required' });
    }

    if (getIsFallback()) {
      const updated = store.addProjectQuestion(id, { question, answer, type });
      return res.json({ success: true, data: updated });
    }

    const proj = await Project.findById(id);
    if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

    proj.questions.push({ question, answer, type });
    await proj.save();
    res.json({ success: true, data: proj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/projects/:id/improvements - Add an improvement log to a project
router.post('/:id/improvements', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date, efficiency } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const dateStr = date || new Date().toISOString().split('T')[0];
    const eff = efficiency !== undefined ? Number(efficiency) : 100;

    if (getIsFallback()) {
      const updated = store.addProjectImprovement(id, { description, date: dateStr, efficiency: eff });
      if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.json({ success: true, data: updated });
    }

    const proj = await Project.findById(id);
    if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

    proj.improvements.push({ description, date: dateStr, efficiency: eff });
    await proj.save();

    // Also update DailyActivity
    let act = await DailyActivity.findOne({ date: dateStr });
    if (!act) {
      act = new DailyActivity({ date: dateStr, solvedCount: 0, itemsSolved: [], averageEfficiency: 0 });
    }
    act.solvedCount += 1;
    act.itemsSolved.push({
      section: 'Project',
      itemId: id,
      title: `Improved ${proj.title}: ${description}`,
      efficiency: eff
    });

    const totalEff = act.itemsSolved.reduce((sum, item) => sum + (item.efficiency || 100), 0);
    act.averageEfficiency = Math.round(totalEff / act.itemsSolved.length);
    act.studyHours = Number((act.solvedCount * 0.75).toFixed(1));

    await act.save();

    res.json({ success: true, data: proj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
