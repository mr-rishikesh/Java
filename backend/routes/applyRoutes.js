const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const { getIsFallback } = require('../config/db');
const store = require('../utils/inMemoryStore');

// GET /api/apply - Get all job applications
router.get('/', async (req, res) => {
  try {
    if (getIsFallback()) {
      return res.json({ success: true, data: store.getJobs() });
    }
    const jobs = await JobApplication.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/apply - Add a new job application
router.post('/', async (req, res) => {
  try {
    const { company, role, location, salary, status, jobUrl, notes } = req.body;
    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and Role are required' });
    }

    if (getIsFallback()) {
      const created = store.addJob({ company, role, location, salary, status, jobUrl, notes });
      return res.json({ success: true, data: created });
    }

    const newJob = new JobApplication({ company, role, location, salary, status, jobUrl, notes });
    await newJob.save();
    res.json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/apply/:id - Update job application status or notes
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsFallback()) {
      const updated = store.updateJob(id, req.body);
      return res.json({ success: true, data: updated });
    }
    const updated = await JobApplication.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/apply/:id/questions - Add company interview question
router.post('/:id/questions', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, round, answerNotes } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    if (getIsFallback()) {
      const updated = store.addJobQuestion(id, { question, round, answerNotes });
      return res.json({ success: true, data: updated });
    }

    const job = await JobApplication.findById(id);
    if (!job) return res.status(404).json({ success: false, message: 'Job Application not found' });

    job.questions.push({ question, round, answerNotes });
    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
